import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CodePanel } from "./code-panel";

describe("CodePanel", () => {
  it("renderiza el título y el chip de estado por defecto", () => {
    const html = renderToStaticMarkup(<CodePanel />);
    expect(html).toContain("auth.ts");
    expect(html).toContain(">HALLAZGO<");
  });

  it("muestra chips de severidad por línea", () => {
    const html = renderToStaticMarkup(
      <CodePanel
        lines={[
          { severity: "warn", content: "código de advertencia" },
          { severity: "pass", content: "código correcto" },
        ]}
      />,
    );
    expect(html).toContain(">ADVERTENCIA<");
    expect(html).toContain(">OK<");
  });

  it("oculta el figcaption cuando no hay caption", () => {
    const html = renderToStaticMarkup(
      <CodePanel caption={undefined} lines={[]} />,
    );
    expect(html).not.toContain("<figcaption");
  });
});
