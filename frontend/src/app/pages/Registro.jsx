import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthForm, ErrorText, FormGroup, SubmitButton } from "../components/AuthForm";

export function Registro() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from;
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await signup(form);
      navigate(from || "/ordenar", { replace: true });
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  return (
    <AuthForm
      eyebrow="Mi cuenta"
      title="Crea tu cuenta"
      footerText="¿Ya tienes cuenta?"
      footerLink="/login"
      footerLabel="Ingresa"
      footerState={{ from }}
    >
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Nombre</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Ej: Juan Pérez" required />
        </FormGroup>

        <FormGroup>
          <label>Correo Electrónico</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" required />
        </FormGroup>

        <FormGroup>
          <label>Contraseña</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} minLength={6} placeholder="Mínimo 6 caracteres" required />
        </FormGroup>

        <SubmitButton type="submit" disabled={sending}>
          {sending ? "Creando cuenta..." : "Registrarme"}
        </SubmitButton>
      </form>

      {error && <ErrorText>{error}</ErrorText>}
    </AuthForm>
  );
}
