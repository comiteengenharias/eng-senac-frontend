import React from "react";
import Link from "next/link";

export default function CadastroTecnico() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Lado esquerdo - Branding */}
      <div style={{ flex: 1, background: "#0A2850", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 48 }}>
        <div style={{ maxWidth: 400 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
            <img src="/img/branding/logo.svg" alt="Robotic Sync" style={{ width: 40, marginRight: 12 }} />
            <span style={{ fontWeight: 700, letterSpacing: 2 }}>ROBOTIC_SYNC</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Torneio de Robótica</h1>
          <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Portal de Acesso</h2>
          <p style={{ fontSize: 16, opacity: 0.8 }}>
            Onde a precisão da engenharia encontra a inovação sustentável. Acesse o portal oficial para gerenciar equipes, matches e avaliações técnicas.
          </p>
        </div>
        <img src="/img/branding/senac-logo-branco.svg" alt="Senac" style={{ width: 100, marginTop: 48 }} />
      </div>
      {/* Lado direito - Formulário */}
      <div style={{ flex: 1, background: "#F8FAFC", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", padding: 40 }}>
          <Link href="/login/robotica_login" style={{ color: "#0A2850", fontWeight: 500, fontSize: 14, textDecoration: "none" }}>
            &larr; Voltar para o Login
          </Link>
          <h2 style={{ fontWeight: 700, fontSize: 24, margin: "24px 0 8px" }}>Create Profile</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Fill in technical credentials to continue.</p>
          {/* Seleção de perfil */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <button style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", fontWeight: 500 }}>ADMIN</button>
            <button style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", background: "#E0E7FF", fontWeight: 700 }}>TÉCNICO</button>
            <button style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", fontWeight: 500 }}>JUIZ</button>
          </div>
          <form>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600, fontSize: 14 }}>NOME COMPLETO</label>
              <input type="text" placeholder="Ex: Roberto Carlos da Silva" style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600, fontSize: 14 }}>CPF</label>
              <input type="text" placeholder="000.000.000-00" style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600, fontSize: 14 }}>E-MAIL</label>
              <input type="email" placeholder="digite seu melhor e-mail" style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600, fontSize: 14 }}>INSTITUIÇÃO DE ENSINO</label>
              <input type="text" placeholder="Ex: SENAC Robotics Lab" style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600, fontSize: 14 }}>SENHA</label>
              <input type="password" placeholder="********" style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 600, fontSize: 14 }}>CONFIRMAÇÃO DE SENHA</label>
              <input type="password" placeholder="********" style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", marginTop: 4 }} />
            </div>
            <button type="submit" style={{ width: "100%", padding: 14, background: "#0A2850", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 16, letterSpacing: 1 }}>FINALIZAR CADASTRO</button>
          </form>
          <div style={{ marginTop: 24, textAlign: "center", fontSize: 14 }}>
            Já tenho conta?{' '}
            <Link href="/login/robotica_login" style={{ color: "#0A2850", fontWeight: 600 }}>Acessar Portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
