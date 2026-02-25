import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";
import os from "os";

// 1. Initialisation des moteurs de DrenoAI
const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let tempFilePath = "";
  
  try {
    console.log("🚀 [DrenoAI] Lancement de l'analyse stratégique...");
    
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "Aucun PDF reçu" }, { status: 400 });

    // 2. Création d'un fichier temporaire sur le serveur (Compatible Windows/Vercel)
    const buffer = Buffer.from(await file.arrayBuffer());
    tempFilePath = path.join(os.tmpdir(), `dreno_upload_${Date.now()}.pdf`);
    fs.writeFileSync(tempFilePath, buffer);

    // 3. Upload vers l'infrastructure Google AI
    console.log("⏳ Upload du guide vers Google Cloud...");
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: "application/pdf",
      displayName: file.name,
    });

    // 4. 🛡️ BOUCLE DE VÉRIFICATION (Polling)
    // On attend que le fichier passe de 'PROCESSING' à 'ACTIVE'
    // On augmente le délai à 10s pour éviter l'erreur 429 (Too Many Requests)
    let remoteFile = await fileManager.getFile(uploadResult.file.name);
    let attempts = 0;
    
    while (remoteFile.state === FileState.PROCESSING && attempts < 6) {
      console.log(`⚡ Traitement en cours... On patiente 10s (Tentative ${attempts + 1}/6)`);
      await new Promise((resolve) => setTimeout(resolve, 10000))
      remoteFile = await fileManager.getFile(uploadResult.file.name);
      attempts++;
    }

    if (remoteFile.state !== FileState.ACTIVE) {
      throw new Error("Le traitement du PDF a pris trop de temps ou a échoué.");
    }

    // 5. Analyse par le modèle Flash (2.0-flash ou 1.5-flash)
    console.log("🤖 Analyse par Gemini 2.0 Flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Utilise "gemini-2.0-flash-exp" si tu veux tester la version 2.0
    
    const prompt = `
      Tu es l'expert marketing de DrenoLearn. Analyse ce guide PDF et génère une fiche produit en JSON.
      RETOURNE UNIQUEMENT LE JSON, SANS TEXTE AVANT OU APRÈS, SANS BALISES MARKDOWN.
      
      {
        "title": "Un titre ultra vendeur",
        "slug": "url-du-guide-2026",
        "marketing_description": "3 paragraphes persuasifs soulignant l'autonomie et l'économie",
        "savings_text": "Économisez environ X FCFA",
        "content_list": [{"title": "Titre du chapitre", "description": "Résumé court"}],
        "old_price": 75000,
        "price": 25000
      }
    `;

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri,
        },
      },
      { text: prompt },
    ]);

    // 6. Extraction et nettoyage du JSON
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    
    // Nettoyage final du fichier temporaire
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

    console.log("✅ [DrenoAI] Guide analysé avec succès !");
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: unknown) {
    console.error("🔥 [DrenoAI] ERREUR CRITIQUE:", error);
    
    // Nettoyage en cas de crash
    if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ 
      error: "L'IA a rencontré un obstacle", 
      details: message 
    }, { status: 500 });
  }
}