export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: 48, color: "#e53e3e" }}>Página não encontrada</h1>
      <p style={{ fontSize: 20, color: "#555" }}>
        Apenas o subdomínio <b>admin</b> tem acesso ao sistema.
      </p>
    </div>
  );
}
