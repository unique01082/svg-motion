import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MotionPreview } from "../components/MotionPreview";
import { specimenBySlug, specimens } from "../specimens/specimens";
import { usePageMeta } from "../hooks/usePageMeta";

const HERO_PRESETS = ["draw", "fade", "scale", "stagger", "pulse"] as const;
type HeroPreset = (typeof HERO_PRESETS)[number];
interface HeroPick {
  readonly slug: string;
  readonly preset: HeroPreset;
  readonly duration: number;
  readonly n: number;
}

function pickRandom<T>(items: readonly T[], not?: T): T {
  const pool = items.length > 1 ? items.filter((i) => i !== not) : items;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

function nextHero(prev: HeroPick): HeroPick {
  return {
    slug: pickRandom(
      specimens.map((s) => s.slug),
      prev.slug,
    ),
    preset: pickRandom(HERO_PRESETS, prev.preset),
    duration: 1200 + Math.floor(Math.random() * 12) * 100,
    n: prev.n + 1,
  };
}

export function HomePage() {
  usePageMeta({
    title: "SVG Motion",
    description:
      "Animate any SVG with a safe, framework-agnostic TypeScript library.",
    canonicalPath: "/",
  });
  // Deterministic first pick keeps prerendered HTML and hydration identical.
  const [pick, setPick] = useState<HeroPick>({
    slug: "des-wand-2",
    preset: "draw",
    duration: 1700,
    n: 1,
  });
  const hero = specimenBySlug(pick.slug);
  const advance = useCallback(() => setPick(nextHero), []);
  useEffect(() => {
    advance();
  }, [advance]);
  const reduced =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onHeroFinish = useCallback(() => {
    if (reduced) return;
    const t = window.setTimeout(advance, 900);
    heroTimer.current = t;
  }, [advance, reduced]);
  const heroTimer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (heroTimer.current !== null) window.clearTimeout(heroTimer.current);
    },
    [],
  );
  const capabilities = [
    {
      specimen: specimenBySlug("cld-cloud-network-folder"),
      preset: "draw" as const,
      title: "Prepare",
      description:
        "Validate, sanitize and namespace before a source reaches the page.",
    },
    {
      specimen: specimenBySlug("com-laptop-code"),
      preset: "stagger" as const,
      title: "Compose",
      description: "Five presets cover line work, leaves and compositions.",
    },
    {
      specimen: specimenBySlug("gen-heart-rate"),
      preset: "pulse" as const,
      title: "Control",
      description:
        "Seek, reverse, finish and restore through a typed lifecycle.",
    },
  ];
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            SVG INPUT / NATIVE MOTION / ZERO RUNTIME EVAL
          </p>
          <h1 aria-label="Motion, measured.">
            Motion,
            <br />
            <em>measured.</em>
          </h1>
          <p>
            Prepare arbitrary SVG sources, protect the document boundary, and
            drive native animation through one predictable controller.
          </p>
          <div className="hero-actions">
            <Link
              className="button button--primary"
              to="/docs/0.1/getting-started"
            >
              Start with 0.1
            </Link>
            <Link className="button" to="/playground">
              Open Playground
            </Link>
          </div>
          <dl className="hero-facts">
            <div>
              <dt>INPUT</dt>
              <dd>Markup · URL · File · Node</dd>
            </div>
            <div>
              <dt>ENGINE</dt>
              <dd>Web Animations API</dd>
            </div>
            <div>
              <dt>ADAPTERS</dt>
              <dd>Core · React 18+</dd>
            </div>
          </dl>
        </div>
        <div className="hero-instrument">
          <header>
            <span>SPECIMEN / {hero.label.toUpperCase()}</span>
            <strong>{pick.preset.toUpperCase()}</strong>
          </header>
          <MotionPreview
            key={pick.n}
            source={hero.source}
            label={hero.label}
            preset={pick.preset}
            duration={pick.duration}
            autoplay
            onFinish={onHeroFinish}
          />
          <footer>
            <span>{String(pick.n).padStart(2, "0")}</span>
            <span>SVGGeometryElement</span>
            <span>{pick.duration}ms</span>
          </footer>
        </div>
      </section>
      <section className="capability-strip" aria-label="Library capabilities">
        {capabilities.map(({ specimen, preset, title, description }) => (
          <article key={title}>
            <MotionPreview
              className="capability-icon"
              source={specimen.source}
              label={`${title}: ${specimen.label}`}
              preset={preset}
              duration={1400}
              autoplay
              compact
            />
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
