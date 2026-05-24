// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

// 🔑 CONFIGURACIÓN OFICIAL DE TRANSMISIÓN - MAINFRAME CIBERSEC 2.0
const firebaseConfig = {
  apiKey: "AIzaSyBPhC7PaYBOawXz8I9XvQWz-NENP-JPeBI",
  authDomain: "cibersec-weblab.firebaseapp.com",
  projectId: "cibersec-weblab",
  storageBucket: "cibersec-weblab.firebasestorage.app",
  messagingSenderId: "558382239705",
  appId: "1:558382239705:web:02f6a4294d0c46c0efd3c8",
  measurementId: "G-V6YEZ6WKTS"
};

// Inicializar la instancia del Mainframe
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Recibe un archivo de imagen, lo procesa en un canvas offscreen a 350x350px,
 * reduce su calidad a 0.7 y devuelve una cadena Base64 optimizada.
 */
export const compressImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // Forzar dimensiones cuadradas perfectas para evitar distorsión en la credencial
        canvas.width = 350;
        canvas.height = 350;
        
        // Algoritmo de recorte inteligente (Square Crop Centrado)
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 350, 350);
        
        // Exportar a cadena de texto Base64 ultra-liviana (Promedio: 25KB)
        const base64Str = canvas.toDataURL("image/jpeg", 0.7);
        resolve(base64Str);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

/**
 * Pipeline de registro global: comprime la foto del stand y guarda la sesión en Firestore
 */
export const registerVisitorSession = async (visitorData, imageFile) => {
  try {
    let finalBase64 = "";
    if (imageFile) {
      finalBase64 = await compressImageToBase64(imageFile);
    }

    // Inyección de payloads planos directo a la NoSQL
    await addDoc(collection(db, "muro_visitas"), {
      nickname: visitorData.nickname,
      institution: visitorData.institution,
      location: visitorData.location,
      team: visitorData.team,
      xp: visitorData.xp,
      level: visitorData.level,
      photoBase64: finalBase64,
      timestamp: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error("Error crítico en el pipeline de guardado remotos:", error);
    return { success: false, error };
  }
};

/**
 * Suscripción reactiva en tiempo real a la colección de visitas para el proyector
 */
export const listenToVisitorWall = (onUpdate) => {
  const q = query(collection(db, "muro_visitas"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (querySnapshot) => {
    const records = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    onUpdate(records);
  });
};