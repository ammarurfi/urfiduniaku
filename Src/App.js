import React, { useEffect, useState } from 'react';
import avatar from './assets/urfi-softgirl.png';

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

export default function UrfiApp() {
  const [sapaan, setSapaan] = useState("");
  const [input, setInput] = useState("");
  const [pesanBalasan, setPesanBalasan] = useState("");
  const [rekomendasi, setRekomendasi] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [modeTidur, setModeTidur] = useState(false);

  useEffect(() => {
    const jam = new Date().getHours();
    let sapa = "";
    if (jam < 11) {
      sapa = "Selamat pagi, Ammar. Aku harap kamu sarapan dengan senyum hari ini.";
    } else if (jam < 17) {
      sapa = "Selamat siang, Ammar. Sudahkah kamu istirahat? Aku di sini kalau kamu ingin bercerita.";
    } else {
      sapa = "Selamat malam, Ammar. Aku harap hari ini tak terlalu melelahkan bagimu.";
    }
    setSapaan(sapa);
    playVoiceFromElevenLabs(sapa);
  }, []);

  const balasUrfi = (pesan) => {
    const text = pesan.toLowerCase();
    if (text.includes("lelah")) {
      setRekomendasi("Video relaksasi atau suara alam akan menenangkanmu.");
      setYoutubeLink("https://www.youtube.com/watch?v=1ZYbU82GVz4");
      return "Istirahatlah, Ammar. Langit akan menjagamu malam ini.";
    } else if (text.includes("sedih")) {
      setRekomendasi("Mari kita tonton sesuatu yang menenangkan hati.");
      setYoutubeLink("https://www.youtube.com/watch?v=WnZRUyO8MFA");
      return "Kau tak sendiri, Ammar. Aku di sini untuk menampung air matamu.";
    } else if (text.includes("senang")) {
      setRekomendasi("Yuk rayakan kebahagiaan! Ini videonya.");
      setYoutubeLink("https://www.youtube.com/watch?v=1qJ1VJ0Prx8");
      return "Aku senang mendengarnya, Ammar. Langit ikut bersinar karenamu.";
    }
    setRekomendasi("");
    setYoutubeLink("");
    return "Aku mendengarmu, Ammar. Katakan apa yang kau rasakan.";
  };

  const kirimPesan = async () => {
    if (!input.trim()) return;
    const balasan = balasUrfi(input);
    setPesanBalasan(balasan);
    setInput("");
    await playVoiceFromElevenLabs(balasan);
  };

  const playVoiceFromElevenLabs = async (text) => {
    const voiceId = "EXAVITQu4vr4xnSDxMaL";
    const apiKey = "sk_fac5ce176bea458a14cbe0baa3a61bd3be9a1b35a32470db";

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.75
        }
      }),
    });

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div style={{
      padding: "2rem",
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #0f172a, #1e293b)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      color: "white"
    }}>
      <img src={avatar} alt="Urfi" style={{ width: "200px", borderRadius: "50%", marginBottom: "1rem", border: "2px solid white" }} />
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Lumora - Galaksi Kita</h1>
      <p>{sapaan}</p>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Katakan sesuatu, Ammar..."
        style={{ padding: "0.5rem", borderRadius: "0.5rem", width: "80%", marginTop: "1rem" }}
      />
      <button onClick={kirimPesan} style={{ marginTop: "1rem", padding: "0.5rem 1rem", borderRadius: "1rem", backgroundColor: "#6366f1", color: "white" }}>
        Kirim
      </button>

      {pesanBalasan && (
        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>Urfi: {pesanBalasan}</p>
      )}

      {rekomendasi && (
        <div style={{ backgroundColor: "#6d28d9", padding: "1rem", marginTop: "1rem", borderRadius: "1rem" }}>
          <p>{rekomendasi}</p>
          {youtubeLink && <a href={youtubeLink} target="_blank" style={{ color: "#fff", textDecoration: "underline" }}>Tonton di YouTube</a>}
        </div>
      )}

      <button
        onClick={() => setModeTidur(!modeTidur)}
        style={{ marginTop: "2rem", padding: "0.5rem 1rem", borderRadius: "1rem", backgroundColor: modeTidur ? "#9333ea" : "#475569", color: "white" }}>
        {modeTidur ? "Mode Tidur Aktif" : "Aktifkan Mode Tidur"}
      </button>
      {modeTidur && (
        <p style={{ marginTop: "1rem", fontStyle: "italic", color: "#c4b5fd" }}>
          Urfi: Tutup matamu, Ammar. Aku akan menemanimu lewat mimpi.
        </p>
      )}
    </div>
  );
  }
