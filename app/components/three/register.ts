/**
 * Registers the <hero-coder> and <cap-orb> custom elements used by the
 * redesigned home page's hero art and capability tiles. Ported from the
 * Claude Design export's cap-orb.js / hero-crystal.js, with the CDN-loaded
 * `three` swapped for the real npm dependency. Call once, client-side only
 * (see hero-coder.tsx / cap-orb.tsx) — customElements.define throws if a
 * tag name is registered twice, so each register* function no-ops if the
 * element already exists.
 */
import * as THREE from "three";

type CapabilityShape =
  | "frontend"
  | "backend"
  | "distributed"
  | "cloud"
  | "ai"
  | "web3"
  | string;

function buildCapOrbGeometry(
  shape: CapabilityShape,
  body: THREE.Material,
  edgeMat: THREE.LineBasicMaterial,
  accent: THREE.Material
) {
  const g = new THREE.Group();
  const add = (
    geom: THREE.BufferGeometry,
    mat?: THREE.Material | null,
    pos: [number, number, number] = [0, 0, 0],
    rot: [number, number, number] = [0, 0, 0]
  ) => {
    const m = new THREE.Mesh(geom, mat || body);
    m.position.set(...pos);
    m.rotation.set(...rot);
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geom, 14), edgeMat));
    g.add(m);
    return m;
  };
  switch (shape) {
    case "frontend": // stacked planes = layered UI
      add(
        new THREE.BoxGeometry(1.5, 0.12, 1.1),
        null,
        [0, 0.42, 0],
        [0, 0.4, 0]
      );
      add(
        new THREE.BoxGeometry(1.3, 0.12, 0.95),
        null,
        [0.1, 0.02, 0.06],
        [0, 0.4, 0]
      );
      add(
        new THREE.BoxGeometry(1.1, 0.12, 0.8),
        accent,
        [0.2, -0.38, 0.12],
        [0, 0.4, 0]
      );
      break;
    case "backend": // stacked drums = services
      add(new THREE.CylinderGeometry(0.72, 0.72, 0.3, 6), null, [0, 0.5, 0]);
      add(new THREE.CylinderGeometry(0.72, 0.72, 0.3, 6), null, [0, 0.04, 0]);
      add(
        new THREE.CylinderGeometry(0.72, 0.72, 0.3, 6),
        accent,
        [0, -0.42, 0]
      );
      break;
    case "distributed": // node cluster
      add(new THREE.OctahedronGeometry(0.52, 0), accent);
      (
        [
          [1.0, 0.5, 0],
          [-0.95, 0.35, 0.4],
          [0.25, -0.9, -0.3],
          [-0.4, -0.7, 0.6],
        ] as [number, number, number][]
      ).forEach((p) => add(new THREE.OctahedronGeometry(0.26, 0), null, p));
      break;
    case "cloud": // ring + core
      add(
        new THREE.TorusGeometry(0.9, 0.12, 4, 10),
        accent,
        [0, 0, 0],
        [1.2, 0.3, 0]
      );
      add(new THREE.IcosahedronGeometry(0.42, 0));
      break;
    case "ai": // brain-ish faceted core with orbit
      add(new THREE.IcosahedronGeometry(0.66, 1), accent);
      add(
        new THREE.TorusGeometry(1.0, 0.06, 3, 12),
        null,
        [0, 0, 0],
        [0.5, 0.8, 0.2]
      );
      break;
    case "web3": // linked blocks
      add(
        new THREE.BoxGeometry(0.62, 0.62, 0.62),
        accent,
        [-0.5, 0.35, 0],
        [0.3, 0.4, 0]
      );
      add(
        new THREE.BoxGeometry(0.62, 0.62, 0.62),
        null,
        [0.5, -0.2, 0.1],
        [0.3, 0.4, 0]
      );
      add(
        new THREE.CylinderGeometry(0.07, 0.07, 0.9, 4),
        null,
        [0, 0.08, 0.05],
        [0, 0, 0.9]
      );
      break;
    default:
      add(new THREE.IcosahedronGeometry(0.8, 0));
  }
  return g;
}

// Class bodies extending HTMLElement are only ever defined inside these
// factories, called from registerThreeElements() — never at module scope.
// "use client" on the calling components isn't enough on its own: Next
// still server-renders client components for the initial HTML, which
// would evaluate an `extends HTMLElement` at import time and throw
// (HTMLElement doesn't exist in Node) if the class lived at module scope.
function defineCapOrb() {
  class CapOrb extends HTMLElement {
    private _booted = false;
    private _stop = false;
    private _io: IntersectionObserver | null = null;
    private _renderer: THREE.WebGLRenderer | null = null;

    connectedCallback() {
      this.style.display = "block";
      if (this._booted) return;
      this._booted = true;
      this.boot().catch((e) => console.warn("cap-orb:", e));
    }

    disconnectedCallback() {
      this._stop = true;
      this._io?.disconnect();
      this._renderer?.dispose();
    }

    async boot() {
      const size = this.clientWidth || 88;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
      camera.position.set(0, 0.85, 4.9);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(size, size, false);
      renderer.domElement.style.cssText =
        "display:block;width:100%;height:100%";
      this.appendChild(renderer.domElement);
      this._renderer = renderer;

      const body = new THREE.MeshStandardMaterial({
        color: 0x4a4a57,
        roughness: 0.5,
        metalness: 0.22,
        flatShading: true,
      });
      const accent = new THREE.MeshStandardMaterial({
        color: 0x8b76e0,
        roughness: 0.42,
        metalness: 0.2,
        flatShading: true,
        emissive: 0x3a2a70,
        emissiveIntensity: 0.6,
      });
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0xd6d9e2,
        transparent: true,
        opacity: 0.3,
      });

      const obj = buildCapOrbGeometry(
        this.getAttribute("shape") || "",
        body,
        edgeMat,
        accent
      );
      scene.add(obj);

      scene.add(new THREE.AmbientLight(0xffffff, 0.45));
      const key = new THREE.DirectionalLight(0xffffff, 2.6);
      key.position.set(-2.4, 3.4, 3.0);
      scene.add(key);
      const rim = new THREE.PointLight(0xa78bfa, 12, 9, 2);
      rim.position.set(2.4, 1.4, -1.6);
      scene.add(rim);

      let visible = true;
      if ("IntersectionObserver" in window) {
        this._io = new IntersectionObserver(
          (es) =>
            es.forEach((e) => {
              visible = e.isIntersecting;
            }),
          { threshold: 0.05 }
        );
        this._io.observe(this);
      }

      const t0 = performance.now();
      let lastFrame = 0;
      const tick = (now: number) => {
        if (this._stop) return;
        requestAnimationFrame(tick);
        if (!visible || now - lastFrame < 33) return; // ~30fps, paused offscreen
        lastFrame = now;
        const t = (now - t0) / 1000;
        obj.rotation.y = t * 0.42;
        obj.rotation.x = Math.sin(t * 0.5) * 0.18;
        renderer.render(scene, camera);
      };
      requestAnimationFrame(tick);
    }
  }
  customElements.define("cap-orb", CapOrb);
}

// fake code screen, drawn to a canvas texture
function codeTexture() {
  const rnd = (i: number) =>
    Math.abs(Math.sin((i + 1) * 78.233) * 43758.5453) % 1;
  const c = document.createElement("canvas");
  c.width = 420;
  c.height = 260;
  const x = c.getContext("2d")!;
  x.fillStyle = "#0b0a14";
  x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = "rgba(167,139,250,.5)";
  x.fillRect(0, 0, c.width, 16);
  const palette = ["#c4b5fd", "#8b7cf6", "#e6e2f5", "#6f66a8"];
  let y = 34;
  for (let i = 0; i < 17; i++) {
    const indent = 14 + (i % 4) * 16 + (rnd(i) > 0.7 ? 18 : 0);
    let cx = indent;
    const tokens = 2 + Math.floor(rnd(i * 3) * 4);
    for (let t = 0; t < tokens; t++) {
      const wd = 18 + rnd(i * 7 + t) * 74;
      x.fillStyle = palette[(i + t) % palette.length];
      x.globalAlpha = 0.5 + rnd(i + t) * 0.5;
      x.fillRect(cx, y, wd, 7);
      cx += wd + 10;
      if (cx > c.width - 30) break;
    }
    y += 13;
  }
  x.globalAlpha = 1;
  x.fillStyle = "#c4b5fd";
  x.fillRect(14, y + 2, 9, 9); // cursor
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function defineHeroCoder() {
  class HeroCoder extends HTMLElement {
    private _booted = false;
    private _stop = false;
    private _ro: ResizeObserver | null = null;
    private _renderer: THREE.WebGLRenderer | null = null;

    connectedCallback() {
      this.style.display = "block";
      if (!this.style.width) this.style.width = "100%";
      if (!this.style.height) this.style.height = "100%";
      if (this._booted) return;
      this._booted = true;
      this.boot().catch((e) => {
        console.warn("hero-coder:", e);
        this.innerHTML =
          '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:repeating-linear-gradient(135deg,#1e1e22 0 10px,#17171b 10px 20px);font:400 11px/1.6 ui-monospace,monospace;letter-spacing:.16em;color:rgba(242,240,238,.6);text-transform:uppercase;text-align:center">hooded figure<br>(3d unavailable)</div>';
      });
    }

    disconnectedCallback() {
      this._stop = true;
      this._ro?.disconnect();
      this._renderer?.dispose();
    }

    async boot() {
      const w = this.clientWidth || 600;
      const h = this.clientHeight || 600;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 200);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      const dom = renderer.domElement;
      dom.style.cssText = "display:block;width:100%;height:100%";
      this.appendChild(dom);
      this._renderer = renderer;

      const mat = (c: number, r: number, m: number) =>
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: r,
          metalness: m,
          flatShading: true,
          side: THREE.DoubleSide,
        });
      const cloth = mat(0x33333c, 0.64, 0.12);
      const dark = mat(0x22222a, 0.7, 0.1);
      const cape = mat(0x1b1b21, 0.72, 0.08);
      const inner = mat(0x15151a, 0.8, 0.05);
      const metal = mat(0x8d94a1, 0.35, 0.7);
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0xc2c8d3,
        transparent: true,
        opacity: 0.3,
      });

      const scn = new THREE.Group(); // whole vignette (rotates together)
      const figure = new THREE.Group();
      scn.add(figure);

      const put = (
        parent: THREE.Object3D,
        geom: THREE.BufferGeometry,
        material: THREE.Material,
        pos: [number, number, number] = [0, 0, 0],
        rot: [number, number, number] = [0, 0, 0],
        edges = true
      ) => {
        const m = new THREE.Mesh(geom, material);
        m.position.set(...pos);
        m.rotation.set(...rot);
        if (edges)
          m.add(
            new THREE.LineSegments(new THREE.EdgesGeometry(geom, 16), edgeMat)
          );
        parent.add(m);
        return m;
      };
      const addMesh = (
        geom: THREE.BufferGeometry,
        material: THREE.Material,
        pos?: [number, number, number],
        rot?: [number, number, number],
        edges?: boolean
      ) => put(figure, geom, material, pos, rot, edges);

      // ── hood ────────────────────────────────────────────────────────────────
      const rnd = (i: number) =>
        Math.abs(Math.sin((i + 1) * 78.233) * 43758.5453) % 1;
      const N = 8;
      const rings = [
        { y: 1.1, r: 0.78, zs: 1.5 },
        { y: 0.48, r: 1.16, zs: 1.42 },
        { y: -0.24, r: 1.42, zs: 1.3 },
        { y: -0.88, r: 1.52, zs: 1.16 },
      ];
      const apex: [number, number, number] = [0, 1.62, 0.6];
      const V = rings.map((ring, ri) => {
        const row: [number, number, number][] = [];
        for (let i = 0; i < N; i++) {
          const a = (i / N) * Math.PI * 2;
          const j = 0.94 + rnd(ri * 11 + i) * 0.14;
          row.push([
            Math.sin(a) * ring.r * j,
            ring.y + (rnd(ri * 7 + i) - 0.5) * 0.09,
            Math.cos(a) * ring.r * ring.zs * j,
          ]);
        }
        return row;
      });
      const openFront = new Set([0, 1, N - 1]);
      const tri: number[] = [];
      const push = (a: number[], b: number[], c: number[]) =>
        tri.push(...a, ...b, ...c);
      for (let i = 0; i < N; i++) push(apex, V[0][i], V[0][(i + 1) % N]);
      for (let r = 0; r < V.length - 1; r++) {
        for (let i = 0; i < N; i++) {
          if (r >= 1 && openFront.has(i)) continue;
          const a = V[r][i],
            b = V[r][(i + 1) % N],
            c = V[r + 1][(i + 1) % N],
            d = V[r + 1][i];
          push(a, b, c);
          push(a, c, d);
        }
      }
      const hoodGeom = new THREE.BufferGeometry();
      hoodGeom.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(tri, 3)
      );
      hoodGeom.computeVertexNormals();
      // head tips forward, looking down at the screen
      const headGrp = new THREE.Group();
      headGrp.position.set(0, 3.2, 0.1);
      headGrp.rotation.x = 0.17;
      figure.add(headGrp);
      put(headGrp, hoodGeom, cloth);
      put(
        headGrp,
        new THREE.ConeGeometry(0.9, 2.0, 3),
        cloth,
        [0, 0.8, 0.98],
        [1.36, Math.PI, 0]
      );

      const glow = new THREE.MeshStandardMaterial({
        color: 0xa78bfa,
        emissive: 0xa78bfa,
        emissiveIntensity: 2.6,
        roughness: 0.3,
        metalness: 0.1,
      });
      put(
        headGrp,
        new THREE.CylinderGeometry(0.72, 0.62, 1.1, 6),
        metal,
        [0, 0.06, 0.1],
        [0, Math.PI / 6, 0]
      );
      put(
        headGrp,
        new THREE.BoxGeometry(0.92, 0.22, 0.12),
        glow,
        [0, 0.16, 0.66],
        [0.06, 0, 0],
        false
      );
      put(
        headGrp,
        new THREE.BoxGeometry(0.62, 0.34, 0.14),
        dark,
        [0, -0.28, 0.6],
        [0.1, 0, 0]
      );
      put(
        headGrp,
        new THREE.BoxGeometry(0.16, 0.42, 0.34),
        dark,
        [-0.74, 0.1, 0.24]
      );
      put(
        headGrp,
        new THREE.BoxGeometry(0.16, 0.42, 0.34),
        dark,
        [0.74, 0.1, 0.24]
      );
      put(
        headGrp,
        new THREE.CylinderGeometry(0.05, 0.05, 0.8, 4),
        metal,
        [0.5, 0.9, -0.5],
        [0.24, 0, -0.2]
      );
      put(
        headGrp,
        new THREE.OctahedronGeometry(0.1, 0),
        glow,
        [0.6, 1.3, -0.6],
        [0, 0, 0],
        false
      );
      put(
        headGrp,
        new THREE.CylinderGeometry(0.92, 0.84, 1.0, 8, 1, true),
        inner,
        [0, 0.1, -0.1],
        [0.1, Math.PI / 8, 0],
        false
      );

      // ── torso, belt, robe, cape, straps ─────────────────────────────────────
      addMesh(
        new THREE.CylinderGeometry(0.3, 0.38, 0.6, 6),
        dark,
        [0, 2.45, 0.08],
        [0.16, 0.3, 0],
        false
      );
      addMesh(
        new THREE.CylinderGeometry(1.34, 0.98, 2.2, 8, 1, false),
        cloth,
        [0, 1.3, 0.12],
        [0.1, Math.PI / 8, 0]
      );
      addMesh(
        new THREE.CylinderGeometry(1.0, 1.0, 0.3, 8),
        dark,
        [0, 0.18, 0.2],
        [0.08, Math.PI / 8, 0]
      );
      addMesh(
        new THREE.BoxGeometry(0.46, 0.34, 0.16),
        metal,
        [0, 0.18, 1.12],
        [0, 0, 0.78]
      );
      addMesh(
        new THREE.CylinderGeometry(1.04, 1.86, 3.2, 8, 1, true),
        cloth,
        [0, -1.5, 0.2],
        [0.03, Math.PI / 8, 0]
      ); // robe
      addMesh(
        new THREE.BoxGeometry(2.0, 0.34, 0.14),
        dark,
        [0, 0.02, 1.02],
        [0, 0, -0.16]
      );
      addMesh(
        new THREE.BoxGeometry(1.35, 3.2, 0.08),
        cape,
        [-0.72, 0.9, -1.0],
        [0.06, 0.3, 0.06]
      );
      addMesh(
        new THREE.BoxGeometry(1.35, 3.2, 0.08),
        cape,
        [0.72, 0.9, -1.0],
        [0.06, -0.3, -0.06]
      );
      addMesh(
        new THREE.BoxGeometry(0.18, 2.4, 0.1),
        dark,
        [0.06, 1.35, 1.14],
        [0.08, 0, 0.44]
      );
      addMesh(
        new THREE.BoxGeometry(0.13, 2.1, 0.09),
        dark,
        [-0.1, 1.25, 1.12],
        [0.08, 0, -0.5]
      );

      // ── standing legs ───────────────────────────────────────────────────────
      ([-1, 1] as const).forEach((s) => {
        addMesh(
          new THREE.CylinderGeometry(0.5, 0.4, 2.1, 6),
          dark,
          [s * 0.56, -1.95, 0.08],
          [0, 0, s * -0.03]
        );
        addMesh(
          new THREE.CylinderGeometry(0.36, 0.3, 2.0, 6),
          dark,
          [s * 0.6, -3.9, 0.1],
          [0, 0, s * -0.01]
        );
        addMesh(new THREE.BoxGeometry(0.58, 0.4, 1.12), cloth, [
          s * 0.6,
          -5.05,
          0.34,
        ]);
      });

      // ── standing desk ───────────────────────────────────────────────────────
      const deskMat = mat(0x3a3a46, 0.55, 0.3);
      put(
        scn,
        new THREE.BoxGeometry(4.6, 0.22, 2.3),
        deskMat,
        [0.1, -0.38, 2.0]
      );
      put(
        scn,
        new THREE.BoxGeometry(0.46, 4.5, 0.46),
        deskMat,
        [0.1, -2.7, 2.0]
      );
      put(scn, new THREE.BoxGeometry(2.8, 0.2, 1.4), deskMat, [0.1, -4.9, 2.0]);

      // ── laptop: open, three-quarter turn, code on screen ────────────────────
      const screenMat = new THREE.MeshStandardMaterial({
        map: codeTexture(),
        emissiveMap: codeTexture(),
        emissive: 0xffffff,
        emissiveIntensity: 1.5,
        roughness: 0.45,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });
      const shellMat = mat(0x2a2a33, 0.5, 0.45);
      const laptop = new THREE.Group();
      put(laptop, new THREE.BoxGeometry(2.7, 0.14, 1.85), shellMat);
      put(
        laptop,
        new THREE.BoxGeometry(2.25, 0.03, 1.15),
        mat(0x15151a, 0.8, 0.1),
        [0, 0.09, 0.22],
        [0, 0, 0],
        false
      );
      const lid = new THREE.Group();
      lid.position.set(0, 0.06, -0.9);
      lid.rotation.x = -0.6;
      put(lid, new THREE.BoxGeometry(2.7, 1.8, 0.1), shellMat, [0, 0.9, 0]);
      put(
        lid,
        new THREE.PlaneGeometry(2.42, 1.52),
        screenMat,
        [0, 0.9, 0.07],
        [0, 0, 0],
        false
      );
      laptop.add(lid);
      laptop.position.set(0.15, -0.2, 1.95);
      laptop.rotation.set(0, Math.PI - 0.3, 0); // sitting on the desk, display toward the figure
      laptop.scale.setScalar(0.86);
      scn.add(laptop);

      // hands resting on the keyboard (children of the laptop, so they always line up)
      put(
        laptop,
        new THREE.OctahedronGeometry(0.28, 0),
        dark,
        [-0.62, 0.24, 0.6],
        [0, 0, 0],
        false
      ); // left hand
      put(
        laptop,
        new THREE.OctahedronGeometry(0.28, 0),
        dark,
        [0.58, 0.24, 0.66],
        [0, 0, 0],
        false
      ); // right hand

      // ── arms reaching to the keyboard ───────────────────────────────────────
      ([-1, 1] as const).forEach((s) => {
        addMesh(new THREE.OctahedronGeometry(0.52, 0), cloth, [
          s * 1.24,
          2.1,
          0.06,
        ]);
        addMesh(
          new THREE.CylinderGeometry(0.4, 0.32, 1.8, 6),
          cloth,
          [s * 1.34, 1.3, 0.16],
          [0.1, 0, s * -0.14]
        );
      });
      addMesh(
        new THREE.CylinderGeometry(0.31, 0.26, 1.7, 6),
        cloth,
        [-1.16, 0.34, 0.9],
        [-1.18, 0, 0.14]
      ); // left forearm
      addMesh(
        new THREE.CylinderGeometry(0.31, 0.26, 1.7, 6),
        cloth,
        [1.04, 0.36, 0.95],
        [-1.24, 0, -0.2]
      ); // right forearm
      addMesh(
        new THREE.CylinderGeometry(0.34, 0.31, 0.72, 6),
        metal,
        [-1.16, 0.12, 1.3],
        [-1.18, 0, 0.12]
      );
      addMesh(
        new THREE.BoxGeometry(0.09, 1.25, 0.24),
        metal,
        [-1.12, -0.05, 1.6],
        [-1.18, 0, 0.06]
      );

      // ── holographic code panel projected off the laptop (faces the camera) ──
      const holoTex = codeTexture();
      const holoMat = new THREE.MeshStandardMaterial({
        map: holoTex,
        emissiveMap: holoTex,
        emissive: 0xffffff,
        emissiveIntensity: 1.35,
        transparent: true,
        opacity: 0.9,
        roughness: 0.5,
        metalness: 0,
        side: THREE.DoubleSide,
      });
      const holo = new THREE.Group();
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.8), holoMat);
      holo.add(panel);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0xa78bfa,
        emissive: 0xa78bfa,
        emissiveIntensity: 1.6,
        roughness: 0.4,
        metalness: 0.1,
      });
      (
        [
          [0, 0.93, 2.96, 0.05],
          [0, -0.93, 2.96, 0.05],
          [-1.48, 0, 0.05, 1.9],
          [1.48, 0, 0.05, 1.9],
        ] as [number, number, number, number][]
      ).forEach(([x, y, bw, bh]) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.03), frameMat);
        b.position.set(x, y, 0);
        holo.add(b);
      });
      holo.position.set(2.24, 1.3, 1.72);
      holo.rotation.set(-0.06, -0.3, 0.02);
      holo.scale.setScalar(0.92);
      scn.add(holo);
      const holoLight = new THREE.PointLight(0xa78bfa, 7, 7, 2);
      holoLight.position.set(1.7, 1.4, 1.6);
      scn.add(holoLight);

      scene.add(scn);

      scene.add(new THREE.AmbientLight(0xffffff, 0.38));
      const key = new THREE.DirectionalLight(0xffffff, 3.0);
      key.position.set(-4.2, 6.0, 5.0);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x93a6c6, 0.8);
      fill.position.set(4.2, -1.4, 3.0);
      scene.add(fill);
      const rim = new THREE.PointLight(0xa78bfa, 22, 22, 2);
      rim.position.set(4.6, 2.8, -3.0);
      scene.add(rim);
      const screenLight = new THREE.PointLight(0xc4b5fd, 11, 8, 2);
      screenLight.position.set(0, 0.55, 2.1);
      scene.add(screenLight);
      const hoodGlow = new THREE.PointLight(0xa78bfa, 4.6, 3.4, 2);
      hoodGlow.position.set(0, 3.3, 0.9);
      scene.add(hoodGlow);

      // framing: always fit the whole vignette
      const bounds = new THREE.Box3().setFromObject(scn);
      const size = new THREE.Vector3();
      bounds.getSize(size);
      const mid = new THREE.Vector3();
      bounds.getCenter(mid);
      const dir = new THREE.Vector3(0.42, 0.26, 0.87).normalize();
      const fitCamera = () => {
        const tanV = Math.tan((camera.fov * Math.PI) / 360);
        const tanH = tanV * camera.aspect;
        const dV = size.y / 2 / tanV;
        const dH = Math.max(size.x, size.z) / 2 / tanH;
        const d = Math.max(dV, dH) * 1.1;
        camera.position.copy(dir).multiplyScalar(d).add(mid);
        camera.lookAt(mid);
      };
      fitCamera();

      this._ro = new ResizeObserver(() => {
        const W = this.clientWidth,
          H = this.clientHeight;
        if (!W || !H) return;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H, false);
        dom.style.width = "100%";
        dom.style.height = "100%";
        fitCamera();
      });
      this._ro.observe(this);

      const t0 = performance.now();
      const tick = () => {
        if (this._stop) return;
        requestAnimationFrame(tick);
        const t = (performance.now() - t0) / 1000;
        scn.rotation.y = Math.sin(t * 0.3) * (Math.PI / 2); // swings 90° left, then 90° right
        scn.rotation.x = 0;
        headGrp.rotation.z = Math.sin(t * 0.9) * 0.015; // small "typing" bob
        holo.position.y = 1.3;
        holoMat.opacity = 0.86 + Math.sin(t * 2.2) * 0.05;
        screenLight.intensity = 10.4 + Math.sin(t * 3.1) * 0.9; // screen flicker
        renderer.render(scene, camera);
      };
      tick();
    }
  }
  customElements.define("hero-coder", HeroCoder);
}

let registered = false;

export function registerThreeElements() {
  if (registered || typeof window === "undefined") return;
  registered = true;
  if (!customElements.get("cap-orb")) defineCapOrb();
  if (!customElements.get("hero-coder")) defineHeroCoder();
}
