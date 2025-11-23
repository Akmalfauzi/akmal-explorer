import { app } from "@/app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🦊 Backend running at http://${app.server?.hostname}:${app.server?.port}`);
  console.log(`📚 Swagger Documentation at http://localhost:${PORT}/docs`);
  console.log(`🚀 API Base URL at http://localhost:${PORT}/api/v1`);
});