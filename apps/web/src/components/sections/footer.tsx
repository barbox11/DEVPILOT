import Container from "@/components/container";

const COLUMNS = [
  {
    heading: "Producto",
    links: ["Escanear", "Informe", "Corregir", "Verificar"],
  },
  {
    heading: "Recursos",
    links: ["Documentación", "Referencia de API", "Cambios", "Estado"],
  },
  {
    heading: "Empresa",
    links: ["Acerca de", "Carreras", "Blog", "Contacto"],
  },
  { heading: "Legal", links: ["Privacidad", "Términos", "Seguridad", "DPA"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container>
        <div className="flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-sm bg-ink font-mono text-sm font-bold text-on-ink"
            >
              DP
            </span>
            <span className="font-mono text-base font-semibold tracking-tight text-text">
              DevPilot
            </span>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
            inspección automática para equipos modernos
          </p>
        </div>
        <div className="grid gap-10 border-t border-border py-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <span className="font-mono text-[13px] text-text-muted">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-border py-8 font-mono text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 DevPilot</span>
          <span className="uppercase tracking-[0.2em]">
            inspeccionado: cada merge, antes de llegar
          </span>
        </div>
      </Container>
    </footer>
  );
}
