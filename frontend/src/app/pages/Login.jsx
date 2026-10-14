import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthForm, ErrorText, FormGroup, SubmitButton } from "../components/AuthForm";

export function Login() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from;
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const user = await signin(form);
      navigate(from || (user.rol === "admin" ? "/admin" : "/mi-cuenta"), { replace: true });
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  return (
    <AuthForm
      eyebrow="Mi cuenta"
      title="Bienvenido de nuevo"
      footerText="¿No tienes cuenta?"
      footerLink="/registro"
      footerLabel="Regístrate"
      footerState={{ from }}
    >
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Correo Electrónico</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" required />
        </FormGroup>

        <FormGroup>
          <label>Contraseña</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </FormGroup>

        <SubmitButton type="submit" disabled={sending}>
          {sending ? "Ingresando..." : "Ingresar"}
        </SubmitButton>
      </form>

      {error && <ErrorText>{error}</ErrorText>}
    </AuthForm>
  );
}
