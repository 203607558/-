import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowUp,
  BadgeCheck,
  Boxes,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Layers3,
  Mail,
  MapPin,
  Maximize2,
  MessageCircle,
  Minus,
  MonitorPlay,
  Palette,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import SideRays from "./SideRays";
import SplashCursor from "./SplashCursor";
import SplineRobot from "./SplineRobot";
import "./styles.css";

const posterModules = import.meta.glob("../海报/**/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

const mainVisualModules = import.meta.glob("../主图/**/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

const skuModules = import.meta.glob("../sku/**/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

const detailModules = import.meta.glob("../详情/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
});

const detailPreviewModules = import.meta.glob("../detail-previews/**/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

const homeBannerModules = import.meta.glob("../首页/新建文件夹/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
});

const viModules = import.meta.glob("../vi/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
});

const packageModules = import.meta.glob("../包装/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
});

const renderingModules = import.meta.glob("../建模渲染/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
});

const mainVideoModules = import.meta.glob("../主图视频/**/*.{mp4,webm,mov,m4v,MP4,WEBM,MOV,M4V}", {
  eager: true,
  query: "?url",
  import: "default",
});

const douyinVideoModules = import.meta.glob("../抖音视频/**/*.{mp4,webm,mov,m4v,MP4,WEBM,MOV,M4V}", {
  eager: true,
  query: "?url",
  import: "default",
});

const assets = {
  resume: new URL("../简历/简历99.jpg", import.meta.url).href,
  avatar: new URL("../头像/头像.jpg", import.meta.url).href,
  qr: new URL("../头像/二维码.jpg", import.meta.url).href,
  homeLogo: new URL("../首页/logo.png", import.meta.url).href,
  skills: {
    photoshop: new URL("../专业技能/Photoshop.webp", import.meta.url).href,
    illustrator: new URL("../专业技能/Illustrator .webp", import.meta.url).href,
    afterEffects: new URL("../专业技能/After Effects.png", import.meta.url).href,
    premiere: new URL("../专业技能/Premiere Pro.webp", import.meta.url).href,
    dreamweaver: new URL("../专业技能/DreamWeaver.webp", import.meta.url).href,
    cinema4d: new URL("../专业技能/Cinema 4D .png", import.meta.url).href,
    octane: new URL("../专业技能/octanerender.png", import.meta.url).href,
    stableDiffusion: new URL("../专业技能/StableDiffusion.jpg", import.meta.url).href,
    midjourney: new URL("../专业技能/Midjourney.jpg", import.meta.url).href,
    codex: new URL("../专业技能/Codex.jpg", import.meta.url).href,
  },
};

const createGalleryItems = (modules, fallbackLabel) =>
  Object.entries(modules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, "zh-Hans-CN"))
  .map(([path, image], index) => {
    const filename = decodeURIComponent(path).split("/").pop()?.replace(/\.[^.]+$/, "") ?? fallbackLabel;

    return {
      image,
      label: filename,
      number: String(index + 1).padStart(2, "0"),
      featured: index < 4,
    };
  });

function hash3(cx, cy, cz, salt) {
  let h = (cx | 0) * 0x8da6b343;
  h ^= Math.imul(cy | 0, 0xd8163841);
  h ^= Math.imul(cz | 0, 0xcb1ab31f);
  h ^= salt | 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const INFINITY_PX_PER_UNIT = 6;
const INFINITY_CELL_SIZE = 110;
const INFINITY_MAX_RANGE = 20;

const posterImages = createGalleryItems(posterModules, "Poster");
const mainVisualImages = createGalleryItems(mainVisualModules, "Main Visual");
const skuImages = createGalleryItems(skuModules, "SKU");
const homeBannerImages = createGalleryItems(homeBannerModules, "Home Banner");
const viImages = createGalleryItems(viModules, "VI Design");
const packageImages = createGalleryItems(packageModules, "Package Design");
const renderingImages = createGalleryItems(renderingModules, "Modeling Rendering");
const mainAigcVideos = createGalleryItems(mainVideoModules, "Main Visual Video");
const douyinVideos = createGalleryItems(douyinVideoModules, "Douyin Video");
const detailPreviewImages = createGalleryItems(detailPreviewModules, "Detail Preview");
const detailPreviewByLabel = new Map(detailPreviewImages.map((image) => [image.label, image.image]));
const detailImages = createGalleryItems(detailModules, "Detail Page").map((image) => ({
  ...image,
  preview: detailPreviewByLabel.get(image.label) ?? image.image,
}));

const initialHash = window.location.hash;

if (initialHash) {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

const profile = {
  name: "杨凡",
  city: "宁波",
  email: "203607558@qq.com",
  wechat: "GPCS-2512",
  title: "视觉设计师 / AI设计师 / 品牌设计师",
  intro: [
    "深耕天猫淘宝京东拼多多全链路视觉设计10年，兼具扎实的商业美学功底与成熟的项目全案把控能力，擅长以转化目标为核心梳理设计逻辑，精准匹配品牌调性与市场审美趋势，可独立主导店铺视觉体系升级、爆款单品详情打造等核心项目。",
    "专业能力覆盖平面视觉、动态剪辑、三维渲染全维度：精通 Photoshop、Illustrator、Premiere、After Effects、Dreamweaver；熟练运用 C4D 搭配 OC 渲染器，完成产品建模、场景搭建、材质表现与写实级渲染输出。",
    "率先搭建AI 智能体设计工作流，深度融合 Midjourney、Stable Diffusion 等 AI 创作工具，可实现创意概念快速发散、多版风格方案预演。",
    "对色彩、材质、空间拥有敏锐的判断力与精准的把控力，始终保持对视觉传达的热忱，持续探索前沿工具与设计创作的深度结合，为电商视觉提供兼具审美与实效的解决方案。",
  ],
};

const stats = [
  ["10+", "年电商视觉经验"],
  ["100+", "商业项目沉淀"],
  ["6", "平台链路覆盖"],
  ["AI", "设计流程加速"],
];

const skillIcons = [
  ["Photoshop", assets.skills.photoshop],
  ["Illustrator", assets.skills.illustrator],
  ["After Effects", assets.skills.afterEffects],
  ["Premiere Pro", assets.skills.premiere],
  ["DreamWeaver", assets.skills.dreamweaver],
  ["Cinema 4D", assets.skills.cinema4d],
  ["octanerender", assets.skills.octane],
  ["StableDiffusion", assets.skills.stableDiffusion],
  ["Midjourney", assets.skills.midjourney],
  ["Codex", assets.skills.codex],
];

const workTimeline = [
  ["2016.03-2017.12", "安吉千竹坊生物科技有限公司"],
  ["2017.01-2017.11", "绿豆芽家居旗舰店"],
  ["2018.03-2019.06", "匠魂时尚家具"],
  ["2018.01-2019.10", "麦群贸易有限公司"],
  ["2020.10-2024.11", "浙江尚纬电子商务股份有限公司"],
  ["2024.12-至今", "慈溪多迷你电子商务有限公司"],
];

const navItems = [
  ["简历", "#about"],
  ["项目", "#poster-design"],
  ["优势", "#strengths"],
  ["联系", "#contact"],
];

const posterStats = [
  [String(posterImages.length), "Poster Works"],
  ["3", "Theme Groups"],
  ["AI", "Visual Extension"],
];

const viStats = [
  [String(viImages.length), "VI Frames"],
  ["3D", "Round Carousel"],
  ["Drag", "Momentum Spin"],
];

const packageStats = [
  [String(packageImages.length), "Package Frames"],
  ["Drag", "Canvas Pan"],
  ["Wheel", "Zoom View"],
];

const renderingStats = [
  [String(renderingImages.length), "Render Frames"],
  ["Drag", "Coverflow Slide"],
  ["Click", "Focus View"],
];

const tmallCategories = ["所有宝贝", "遥控开关", "门铃", "定时开关", "五金工具", "电子电工", "家装建材", "居家日用"];

const mainSkuStats = [
  [String(mainVisualImages.length), "Main Visuals"],
  [String(skuImages.length), "SKU Frames"],
  [String(detailImages.length), "Detail Frames"],
];

const aigcVideoStats = [
  [String(mainAigcVideos.length), "Tmall Videos"],
  [String(douyinVideos.length), "Douyin Reels"],
  ["AI", "Video Workflow"],
];

const contents = [
  ["01", "海报设计", "Poster Design", "poster", "#poster-design"],
  ["02", "首页banner", "Home Banner", "home", "#home-banner"],
  ["03", "VI设计", "VI Design", "diamond", "#vi-design"],
  ["04", "包装设计", "Package Design", "package", "#package-design"],
  ["05", "建模渲染", "Modeling and Rendering", "cube", "#modeling-rendering"],
  ["06", "主图SKU详情", "Detail Pages", "clipboard", "#main-sku-detail"],
  ["07", "AIGC", "Artificial Intelligence", "brain", "#aigc-design"],
  ["08", "抖音视频", "Douyin Reels", "star", "#aigc-douyin"],
];

function ContentIcon({ type }) {
  const baseProps = {
    className: "content-icon-mark",
    viewBox: "0 0 64 64",
    fill: "none",
    "aria-hidden": "true",
  };

  switch (type) {
    case "poster":
      return (
        <svg {...baseProps}>
          <path d="M28 15H18.5C12.7 15 8 19.7 8 25.5S12.7 36 18.5 36H28V15Z" />
          <path d="M36 15h9.5C51.3 15 56 19.7 56 25.5S51.3 36 45.5 36H36V15Z" />
          <path d="M28 49H18.5C12.7 49 8 44.3 8 38.5S12.7 28 18.5 28H28v21Z" />
          <path d="M36 49h9.5C51.3 49 56 44.3 56 38.5S51.3 28 45.5 28H36v21Z" />
        </svg>
      );
    case "home":
      return (
        <svg {...baseProps}>
          <path d="M12 31.5 32 15l20 16.5V54a3 3 0 0 1-3 3H39V41H25v16H15a3 3 0 0 1-3-3V31.5Z" />
          <path d="M24 55h16" />
          <path d="M19 32.5 32 22l13 10.5" />
        </svg>
      );
    case "diamond":
      return (
        <svg {...baseProps}>
          <path d="M32 8 56 28 32 58 8 28 32 8Z" />
          <path d="m22 27 10 10 10-10" />
          <path d="M17 28h30" />
        </svg>
      );
    case "package":
      return (
        <svg {...baseProps}>
          <path d="M11 19.5 32 8l21 11.5v25L32 56 11 44.5v-25Z" />
          <path d="m11 19.5 21 12 21-12" />
          <path d="M32 31.5V56" />
          <path d="M22 14.5 43 26" />
          <path d="M45 35.5v6M17 35.5v4" />
        </svg>
      );
    case "cube":
      return (
        <svg {...baseProps}>
          <path d="M32 7 12 18.5v27L32 57l20-11.5v-27L32 7Z" />
          <path d="M12 18.5 32 30l20-11.5" />
          <path d="M32 30v27" />
          <path d="m22 24 10-5.5L42 24v12l-10 5.5L22 36V24Z" />
          <path d="m22 24 10 6 10-6" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...baseProps}>
          <path d="M22 11h20l5 7v37H17V18l5-7Z" />
          <path d="M24 18h16" />
          <path d="M25 30h14M25 39h14M25 48h9" />
          <path d="M42 11v9h9" />
        </svg>
      );
    case "brain":
      return (
        <svg {...baseProps}>
          <path d="M25 10c-6 0-10 4.5-10 10.5 0 1.3.2 2.5.7 3.6A10.2 10.2 0 0 0 13 43.5C13 50.4 18.6 56 25.5 56c3.5 0 6.6-1.4 8.9-3.8A12 12 0 0 0 56 45v-2.2a9.7 9.7 0 0 0-.2-18.5A10.3 10.3 0 0 0 39.2 13 12.2 12.2 0 0 0 25 10Z" />
          <path d="M31 18v29M38 24h10M39 36h15M22 29h-9M22 41h-8" />
          <circle cx="50" cy="24" r="3" />
          <circle cx="54" cy="36" r="3" />
          <circle cx="13" cy="29" r="3" />
          <circle cx="14" cy="41" r="3" />
        </svg>
      );
    default:
      return (
        <svg {...baseProps}>
          <path d="M32 8 39.2 23l16.6 2.4-12 11.6 2.8 16.4L32 45.7 17.4 53.4 20.2 37 8.2 25.4 24.8 23 32 8Z" />
          <circle cx="32" cy="32" r="25" />
        </svg>
      );
  }
}

const strengths = [
  {
    icon: <Palette />,
    title: "品牌视觉判断",
    text: "把控色彩、字体、版式与视觉秩序，帮助品牌形成稳定且有辨识度的表达。",
  },
  {
    icon: <MonitorPlay />,
    title: "电商转化设计",
    text: "理解主图、Banner、SKU、详情页的信息节奏，兼顾点击、阅读和购买决策。",
  },
  {
    icon: <BrainCircuit />,
    title: "AI 工作流整合",
    text: "熟练使用 Midjourney、Stable Diffusion 等工具，将 AI 融入创意发散与提效流程。",
  },
  {
    icon: <Boxes />,
    title: "三维场景表达",
    text: "掌握 C4D 与 OC 渲染器，能针对产品、材质、空间与氛围建立可信场景。",
  },
  {
    icon: <Layers3 />,
    title: "复杂信息组织",
    text: "将卖点、参数和品牌语气拆解成清晰层级，适配长图、专题页和系列化物料。",
  },
  {
    icon: <Sparkles />,
    title: "风格适配能力",
    text: "能够快速响应不同品类、渠道和活动主题，在统一审美下做差异化表达。",
  },
];

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="回到首页">
        <span className="brand-mark">YF</span>
        <span>Yang Fan</span>
      </a>
      <nav>
        {navItems.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <a className="header-cta" href="#contact">
        联系我 <ArrowUpRight size={16} />
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="hero">
      <SplineRobot />
      <div className="hero-shade" />
      <div className="hero-effects" aria-hidden="true">
        <div className="side-rays-frame">
          <SideRays
            rayColor1="#EAB308"
            rayColor2="#96c8ff"
            origin="top-right"
            speed={2.5}
            intensity={2}
            spread={2}
            tilt={0}
            saturation={1.5}
            blend={0.75}
            falloff={1.6}
            opacity={1}
          />
        </div>
        <SplashCursor
          SIM_RESOLUTION={96}
          DYE_RESOLUTION={640}
          DENSITY_DISSIPATION={3.5}
          VELOCITY_DISSIPATION={2}
          PRESSURE={0.1}
          PRESSURE_ITERATIONS={8}
          CURL={3}
          SPLAT_RADIUS={0.16}
          SPLAT_FORCE={3200}
          SHADING={false}
          COLOR_UPDATE_SPEED={6}
        />
      </div>
      <Header />
      <div className="hero-inner">
        <div className="eyebrow">
          <span />
          2026 Portfolio
        </div>
        <h1>
          Design Portfolio
          <br />
          & Resume
        </h1>
        <div className="hero-bottom">
          <p>
            品牌视觉设计作品合集,
            <br />
            每一个像素，都有它的理由!
          </p>
          <a className="primary-link" href="#poster-design">
            查看项目 <ChevronRight size={18} />
          </a>
        </div>
      </div>
      <div className="scroll-cue">Scroll</div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section about-section">
      <div className="section-heading">
        <span>01 / Resume</span>
        <h2>个人简历</h2>
      </div>
      <div className="resume-panel">
        <div className="resume-top">
          <div className="resume-identity">
            <img className="avatar-image" src={assets.avatar} alt={`${profile.name}头像`} />
            <div>
              <div className="role-pill">
                <BadgeCheck size={17} />
                {profile.title}
              </div>
              <h3>{profile.name}</h3>
              <div className="contact-strip">
                <a href={`mailto:${profile.email}`}>
                  <Mail size={18} />
                  {profile.email}
                </a>
                <span>
                  <MapPin size={18} />
                  {profile.city}
                </span>
              </div>
            </div>
          </div>
          <div className="qr-card">
            <img src={assets.qr} alt="微信二维码" />
            <span>扫码添加微信</span>
            <strong>
              <MessageCircle size={16} />
              WeChat: {profile.wechat}
            </strong>
          </div>
        </div>

        <div className="resume-body">
          <div className="intro-stack">
            {profile.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="stats-grid">
            {stats.map(([number, label]) => (
              <div className="stat-card" key={label}>
                <strong>
                  <span>{number}</span>
                </strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="resume-block">
          <div className="resume-block-heading">
            <span>Professional Skills</span>
            <h3>专业技能</h3>
          </div>
          <div className="skills-icon-grid">
            {skillIcons.map(([label, icon]) => (
              <div className="skill-icon-card" key={label}>
                <div className="skill-icon-box">
                  <img src={icon} alt={label} />
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="resume-block">
          <div className="resume-block-heading">
            <span>Experience Timeline</span>
            <h3>工作经历</h3>
          </div>
          <div className="timeline-row">
            {workTimeline.map(([date, company], index) => (
              <div className="timeline-item" key={`${date}-${company}`}>
                <em>{String(index + 1).padStart(2, "0")}</em>
                <span>{date}</span>
                <strong>{company}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="section projects-section">
      <div className="contents-panel">
        <div className="contents-title">
          <div>
            <span>Contents</span>
            <h2>目录</h2>
          </div>
        </div>
        <div className="contents-grid">
          {contents.map(([number, title, subtitle, iconType, href]) => (
            <a className="content-item" href={href} key={number}>
              <strong data-number={number}>{number}</strong>
              <h3>{title}</h3>
              <span>{subtitle}</span>
              <div className="content-icon-shell">
                <ContentIcon type={iconType} />
              </div>
              <em />
            </a>
          ))}
        </div>
      </div>
      <PosterDesignModule />
      <HomeBannerModule />
      <ViDesignModule />
      <PackageDesignModule />
      <ModelingRenderingModule />
      <MainSkuDetailModule />
      <AigcVideoModule />
    </section>
  );
}

function AigcVideoModule() {
  const mainVideos = mainAigcVideos.slice(0, 4);
  const shortVideos = douyinVideos;

  if (mainVideos.length === 0 && shortVideos.length === 0) {
    return null;
  }

  return (
    <section id="aigc-design" className="aigc-video-module" aria-labelledby="aigc-video-title">
      <div className="aigc-video-heading">
        <div>
          <span>Tmall & Douyin Video</span>
          <h2 id="aigc-video-title">天猫视频与抖音视频</h2>
          <p>AI 辅助创意提效・电商素材规模化生产</p>
        </div>
      </div>

      <div className="aigc-video-stats">
        {aigcVideoStats.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {mainVideos.length > 0 ? (
        <div className="aigc-main-video-grid" aria-label="天猫视频">
          {mainVideos.map((video) => (
            <article className="aigc-main-video-card" key={video.image}>
              <div className="aigc-video-frame">
                <video src={video.image} controls preload="metadata" playsInline />
              </div>
              <div className="aigc-video-meta">
                <span>{video.number}</span>
                <strong>{video.label}</strong>
                <em>天猫视频</em>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {shortVideos.length > 0 ? (
        <div className="aigc-douyin-block" id="aigc-douyin">
          <div className="aigc-douyin-title">
            <div>
              <span>Douyin Reels</span>
              <strong>抖音视频</strong>
            </div>
            <p>内容电商种草视觉・短视频流量适配设计</p>
          </div>
          <div className="aigc-douyin-rail" aria-label="抖音短视频">
            {shortVideos.map((video) => (
              <article className="aigc-douyin-card" key={video.image}>
                <div className="aigc-douyin-frame">
                  <video src={video.image} controls preload="metadata" playsInline />
                </div>
                <div className="aigc-video-meta">
                  <span>{video.number}</span>
                  <strong>{video.label}</strong>
                  <em>抖音短视频</em>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PosterDesignModule() {
  const [activePoster, setActivePoster] = useState(posterImages[1] ?? posterImages[0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const featuredPosters = posterImages.slice(0, 7);

  useEffect(() => {
    if (!isLightboxOpen) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isLightboxOpen]);

  const activatePoster = (poster) => {
    setActivePoster(poster);
  };

  const moveCardLight = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    event.currentTarget.style.setProperty("--pointer-x", `${x}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${y}%`);
  };

  return (
    <section id="poster-design" className="poster-design-module" aria-labelledby="poster-module-title">
      <div className="poster-module-copy">
        <span>Custom Spaces</span>
        <h2 id="poster-module-title">海报设计</h2>
        <p>全场景营销视觉落地・活动转化视觉支撑</p>
        <div className="poster-module-stats">
          {posterStats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="poster-showcase" aria-label="海报作品预览">
        <article className="poster-focus-viewer">
          <button
            className="poster-expand-button"
            type="button"
            aria-label="放大查看当前海报"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Maximize2 size={18} />
          </button>
          <div className="poster-focus-image">
            <img key={activePoster.image} src={activePoster.image} alt={`${activePoster.label} 海报完整预览`} />
          </div>
          <div className="poster-focus-meta">
            <span>{activePoster.number}</span>
            <strong>{activePoster.label}</strong>
            <em>Poster Focus</em>
          </div>
        </article>

        <div className="poster-feature-stack">
          {featuredPosters.map((poster, index) => (
            <article
              className={`poster-space-card poster-space-card-${index + 1} ${
                activePoster.image === poster.image ? "is-active" : ""
              }`}
              key={poster.image}
              onClick={() => activatePoster(poster)}
              onFocus={() => activatePoster(poster)}
              onMouseEnter={() => activatePoster(poster)}
              onMouseMove={moveCardLight}
              tabIndex={0}
            >
              <img src={poster.image} alt={`${poster.label} 海报设计`} />
              <div className="poster-space-meta">
                <span>{poster.number}</span>
                <strong>{poster.label}</strong>
                <em>Poster Design</em>
              </div>
            </article>
          ))}
        </div>

        <div className="poster-mini-rail">
          {posterImages.map((poster) => (
            <button
              className={`poster-mini-card ${activePoster.image === poster.image ? "is-active" : ""}`}
              key={poster.image}
              onClick={() => activatePoster(poster)}
              onFocus={() => activatePoster(poster)}
              onMouseEnter={() => activatePoster(poster)}
              type="button"
            >
              <img src={poster.image} alt={`${poster.label} 海报设计`} />
              <span>{poster.number}</span>
            </button>
          ))}
        </div>
      </div>

      {isLightboxOpen ? (
        <div
          className="poster-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activePoster.label} 海报放大预览`}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setIsLightboxOpen(false);
            }
          }}
        >
          <button
            className="poster-lightbox-close"
            type="button"
            aria-label="关闭海报预览"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X size={22} />
          </button>
          <figure className="poster-lightbox-frame">
            <img src={activePoster.image} alt={`${activePoster.label} 海报放大预览`} />
            <figcaption>
              <span>{activePoster.number}</span>
              <strong>{activePoster.label}</strong>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </section>
  );
}

function HomeBannerModule() {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const activeBanner = homeBannerImages[activeBannerIndex];

  useEffect(() => {
    if (homeBannerImages.length <= 1) {
      return undefined;
    }

    const rotationTimer = window.setInterval(() => {
      setActiveBannerIndex((currentIndex) => (currentIndex + 1) % homeBannerImages.length);
    }, 4200);

    return () => window.clearInterval(rotationTimer);
  }, []);

  if (!activeBanner) {
    return null;
  }

  const goToBanner = (nextIndex) => {
    setActiveBannerIndex((nextIndex + homeBannerImages.length) % homeBannerImages.length);
  };

  return (
    <section id="home-banner" className="home-banner-module" aria-labelledby="home-banner-title">
      <div className="home-banner-heading">
        <span>Custom Spaces</span>
        <h2 id="home-banner-title">首页 Banner</h2>
        <p>首屏视觉策略设计・点击率优化视觉方案</p>
      </div>

      <div className="home-banner-showcase">
        <div className="tmall-shop-sign" aria-label="天猫店招">
          <div className="tmall-logo-block">
            <img src={assets.homeLogo} alt="店铺 logo" />
          </div>
          <nav className="tmall-category-nav" aria-label="店铺分类">
            {tmallCategories.map((category) => (
              <a href="#home-banner" key={category}>
                {category}
              </a>
            ))}
          </nav>
        </div>

        <div className="home-banner-carousel" aria-label="常新旗舰店首页轮播图">
          <figure className="home-banner-focus">
            <img key={activeBanner.image} src={activeBanner.image} alt={`${activeBanner.label} 首页轮播图`} />
            <figcaption className="home-banner-overlay">
              <span>{activeBanner.number}</span>
              <strong>{activeBanner.label}</strong>
              <em>Changxin Home Banner</em>
            </figcaption>
          </figure>

          <div className="home-banner-controls" aria-label="轮播图控制">
            <button type="button" aria-label="上一张首页轮播图" onClick={() => goToBanner(activeBannerIndex - 1)}>
              <ChevronLeft size={20} />
            </button>
            <div>
              {homeBannerImages.map((banner, index) => (
                <button
                  className={activeBanner.image === banner.image ? "is-active" : ""}
                  type="button"
                  aria-label={`切换到 ${banner.label}`}
                  aria-current={activeBanner.image === banner.image ? "true" : undefined}
                  key={banner.image}
                  onClick={() => goToBanner(index)}
                />
              ))}
            </div>
            <button type="button" aria-label="下一张首页轮播图" onClick={() => goToBanner(activeBannerIndex + 1)}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="home-banner-thumb-rail" aria-label="首页轮播缩略图">
            {homeBannerImages.map((banner, index) => (
              <button
                className={activeBanner.image === banner.image ? "is-active" : ""}
                type="button"
                key={banner.image}
                onClick={() => goToBanner(index)}
                onFocus={() => goToBanner(index)}
                onMouseEnter={() => goToBanner(index)}
              >
                <img src={banner.image} alt={`${banner.label} 缩略图`} />
                <span>{banner.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ViDesignModule() {
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const dragRef = useRef({
    isDragging: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
    preventClick: false,
  });
  const clickResetRef = useRef(null);
  const [activeViIndex, setActiveViIndex] = useState(0);
  const [isViDragging, setIsViDragging] = useState(false);
  const displayImages = useMemo(() => [...viImages].reverse(), []);
  const activeVi = displayImages[activeViIndex];

  useEffect(() => {
    if (!activeVi) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      const stage = stageRef.current;
      const activeCard = cardRefs.current[activeViIndex];

      if (!stage || !activeCard) {
        return;
      }

      const stageRect = stage.getBoundingClientRect();
      const cardRect = activeCard.getBoundingClientRect();
      const targetLeft =
        stage.scrollLeft + cardRect.left - stageRect.left - (stage.clientWidth - cardRect.width) / 2;

      stage.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: dragRef.current.isDragging ? "auto" : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeVi, activeViIndex]);

  useEffect(() => {
    if (displayImages.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      if (dragRef.current.isDragging) {
        return;
      }

      setActiveViIndex((current) => (current + 1) % displayImages.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [displayImages.length]);

  useEffect(
    () => () => {
      if (clickResetRef.current !== null) {
        window.clearTimeout(clickResetRef.current);
      }
    },
    [],
  );

  if (!activeVi) {
    return null;
  }

  const syncActiveFromCenter = () => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const stageCenter = stage.getBoundingClientRect().left + stage.clientWidth / 2;
    let nearestIndex = activeViIndex;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, index) => {
      if (!card) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - stageCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setActiveViIndex(nearestIndex);
  };

  const focusViImage = (index) => {
    setActiveViIndex(index);
  };

  const startDrag = (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") {
      return;
    }

    dragRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: stageRef.current?.scrollLeft ?? 0,
      moved: false,
      preventClick: false,
    };
    setIsViDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const dragCarousel = (event) => {
    if (!dragRef.current.isDragging || dragRef.current.pointerId !== event.pointerId || !stageRef.current) {
      return;
    }

    event.preventDefault();
    const deltaX = event.clientX - dragRef.current.startX;
    dragRef.current.moved = dragRef.current.moved || Math.abs(deltaX) > 3;
    stageRef.current.scrollLeft = dragRef.current.startScrollLeft - deltaX;
  };

  const endDrag = (event) => {
    if (!dragRef.current.isDragging || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    const shouldSuppressClick = dragRef.current.moved;
    dragRef.current.isDragging = false;
    dragRef.current.pointerId = null;
    dragRef.current.preventClick = shouldSuppressClick;
    setIsViDragging(false);
    syncActiveFromCenter();

    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture can already be released when the pointer leaves the stage.
    }

    if (shouldSuppressClick) {
      if (clickResetRef.current !== null) {
        window.clearTimeout(clickResetRef.current);
      }

      clickResetRef.current = window.setTimeout(() => {
        dragRef.current.preventClick = false;
        dragRef.current.moved = false;
        clickResetRef.current = null;
      }, 160);
    }
  };

  return (
    <section id="vi-design" className="vi-design-module" aria-labelledby="vi-design-title">
      <div className="vi-design-heading">
        <div>
          <span>Round Carousel</span>
          <h2 id="vi-design-title">VI 设计</h2>
        </div>
        <p>品牌视觉体系搭建・全渠道调性统一规范</p>
      </div>

      <div
        className={`vi-round-stage ${isViDragging ? "is-dragging" : ""}`}
        ref={stageRef}
        onPointerDown={startDrag}
        onPointerMove={dragCarousel}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(event) => {
          if (dragRef.current.isDragging) {
            endDrag(event);
          }
        }}
        aria-label="VI 设计圆形轮播"
      >
        <div className="vi-round-carousel">
          {displayImages.map((image, index) => (
            <button
              className={`vi-round-card ${activeVi.image === image.image ? "is-active" : ""}`}
              key={image.image}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              type="button"
              onClick={(event) => {
                if (dragRef.current.preventClick) {
                  event.preventDefault();
                  dragRef.current.preventClick = false;
                  dragRef.current.moved = false;
                  return;
                }

                focusViImage(index);
              }}
            >
              <span className="vi-card-face vi-card-front">
                <img src={image.image} alt={`${image.label} VI 设计`} draggable={false} />
              </span>
              <span className="vi-card-number">{image.number}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="vi-design-footer">
        <div className="vi-design-stats">
          {viStats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OriginkitInfinityGallery({
  images,
  density = 5,
  imageWidth = 150,
  imageHeight = 150,
  rounded = 3,
  dragSpeed = 20,
  driftAmount = 20,
  friction = 10,
  backgroundColor = "#000000",
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const valuesRef = useRef({
    targetX: 0,
    targetY: 0,
    camX: 0,
    camY: 0,
    velX: 0,
    velY: 0,
    targetLogZoom: 0,
    logZoom: 0,
    velLogZoom: 0,
    driftTargetX: 0,
    driftTargetY: 0,
    driftX: 0,
    driftY: 0,
  });

  const safeImages = useMemo(() => (Array.isArray(images) && images.length > 0 ? images : []), [images]);

  const settings = useMemo(() => {
    const safeDensity = clamp(Math.floor(density || 5), 1, 15);
    const subN = Math.max(1, Math.ceil(Math.sqrt(safeDensity)));
    const subSize = INFINITY_CELL_SIZE / subN;

    return {
      safeDensity,
      safeImageWidth: clamp(imageWidth || 150, 8, 4000),
      safeImageHeight: clamp(imageHeight || 150, 8, 4000),
      safeRounded: clamp(rounded ?? 3, 0, 20),
      safeDragSpeed: clamp((dragSpeed || 20) / 20, 0.1, 5),
      safeDriftAmount: clamp(driftAmount ?? 8, 0, 20),
      safeFriction: 1 - (clamp(friction ?? 10, 1, 20) / 20) * 0.3,
      subN,
      subSize,
      effectivePerCell: Math.min(safeDensity, subN * subN),
    };
  }, [density, imageWidth, imageHeight, rounded, dragSpeed, driftAmount, friction]);

  const generateCell = useMemo(() => {
    const imagesCount = safeImages.length;
    const {
      safeImageWidth,
      safeImageHeight,
      subN,
      subSize,
      effectivePerCell,
    } = settings;

    return (gx, gy, octave) => {
      const seed = hash3(gx, gy, octave | 0, 0x9e3779b1);
      const rand = mulberry32(seed);
      const totalSubs = subN * subN;
      const subs = new Array(totalSubs);

      for (let i = 0; i < totalSubs; i += 1) {
        subs[i] = i;
      }

      for (let i = totalSubs - 1; i > 0; i -= 1) {
        const j = Math.floor(rand() * (i + 1));
        const tmp = subs[i];
        subs[i] = subs[j];
        subs[j] = tmp;
      }

      const tiles = [];
      const count = Math.min(effectivePerCell, totalSubs);
      const pad = subSize * 0.1;
      const innerRange = Math.max(0, subSize - pad * 2);
      const cellX0 = gx * INFINITY_CELL_SIZE;
      const cellY0 = gy * INFINITY_CELL_SIZE;
      const wWorld = safeImageWidth / INFINITY_PX_PER_UNIT;
      const hWorld = safeImageHeight / INFINITY_PX_PER_UNIT;

      for (let slot = 0; slot < count; slot += 1) {
        const subIdx = subs[slot];
        const sx = subIdx % subN;
        const sy = Math.floor(subIdx / subN);

        tiles.push({
          wx: cellX0 + sx * subSize + pad + rand() * innerRange,
          wy: cellY0 + sy * subSize + pad + rand() * innerRange,
          cx: gx,
          cy: gy,
          slot,
          octave,
          imgIdx: imagesCount > 0 ? Math.floor(rand() * imagesCount) % imagesCount : 0,
          w: wWorld,
          h: hWorld,
          rot: 0,
          bakedScale: 0.45 + rand() * (1.6 - 0.45),
        });
      }

      return tiles;
    };
  }, [safeImages.length, settings]);

  useEffect(() => {
    const scene = sceneRef.current;
    const container = containerRef.current;

    if (!scene || safeImages.length === 0) {
      return undefined;
    }

    const values = valuesRef.current;
    const layerPools = new Map();
    let cW = container?.clientWidth || 900;
    let cH = container?.clientHeight || 600;
    let resizeObserver;

    if (container && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        cW = container.clientWidth || cW;
        cH = container.clientHeight || cH;
      });
      resizeObserver.observe(container);
    }

    const getPool = (octave) => {
      let pool = layerPools.get(octave);

      if (!pool) {
        pool = { tileEls: new Map(), imgEls: new Map() };
        layerPools.set(octave, pool);
      }

      return pool;
    };

    const disposeLayer = (octave) => {
      const pool = layerPools.get(octave);

      if (!pool) {
        return;
      }

      pool.tileEls.forEach((element) => {
        if (element.parentNode === scene) {
          scene.removeChild(element);
        }
      });
      pool.tileEls.clear();
      pool.imgEls.clear();
      layerPools.delete(octave);
    };

    const removeTile = (octave, key) => {
      const pool = layerPools.get(octave);

      if (!pool) {
        return;
      }

      const element = pool.tileEls.get(key);

      if (element && element.parentNode === scene) {
        scene.removeChild(element);
      }

      pool.tileEls.delete(key);
      pool.imgEls.delete(key);
    };

    const ensureTile = (tile) => {
      const pool = getPool(tile.octave);
      const key = `${tile.cx},${tile.cy},${tile.slot}`;
      let element = pool.tileEls.get(key);

      if (!element) {
        element = document.createElement("div");
        element.className = "package-infinity-tile";
        element.dataset.tileKey = key;

        const img = document.createElement("img");
        const src = safeImages[tile.imgIdx];
        img.src = src?.src || "";
        img.alt = src?.alt || "";
        img.draggable = false;
        img.decoding = "async";

        element.appendChild(img);
        scene.appendChild(element);
        pool.tileEls.set(key, element);
        pool.imgEls.set(key, img);
      }

      return element;
    };

    const projectLayer = (octave, layerScale, layerAlpha, layerZBase, cx, cy) => {
      const pool = getPool(octave);
      const camCellX = Math.floor(cx / INFINITY_CELL_SIZE);
      const camCellY = Math.floor(cy / INFINITY_CELL_SIZE);
      const worldHalfX = cW / 2 / (INFINITY_PX_PER_UNIT * layerScale);
      const worldHalfY = cH / 2 / (INFINITY_PX_PER_UNIT * layerScale);
      const rangeX = Math.min(INFINITY_MAX_RANGE, Math.ceil(worldHalfX / INFINITY_CELL_SIZE) + 1);
      const rangeY = Math.min(INFINITY_MAX_RANGE, Math.ceil(worldHalfY / INFINITY_CELL_SIZE) + 1);
      const visibleKeys = new Set();
      const tilesThisFrame = [];

      for (let dy = -rangeY; dy <= rangeY; dy += 1) {
        for (let dx = -rangeX; dx <= rangeX; dx += 1) {
          tilesThisFrame.push(...generateCell(camCellX + dx, camCellY + dy, octave));
        }
      }

      const orderKeys = new Array(tilesThisFrame.length);
      const orderScale = new Array(tilesThisFrame.length);

      for (let i = 0; i < tilesThisFrame.length; i += 1) {
        const tile = tilesThisFrame[i];
        const key = `${tile.cx},${tile.cy},${tile.slot}`;
        visibleKeys.add(key);

        const dxPx = (tile.wx - cx) * layerScale * INFINITY_PX_PER_UNIT;
        const dyPx = (tile.wy - cy) * layerScale * INFINITY_PX_PER_UNIT;
        const scale = tile.bakedScale * layerScale;
        const element = ensureTile(tile);
        const img = pool.imgEls.get(key);
        const wPx = tile.w * INFINITY_PX_PER_UNIT;
        const hPx = tile.h * INFINITY_PX_PER_UNIT;

        element.style.width = `${wPx}px`;
        element.style.height = `${hPx}px`;
        element.style.opacity = String(layerAlpha);
        element.style.transform = `translate3d(${dxPx}px, ${dyPx}px, 0) scale(${scale}) rotate(${tile.rot}deg) translate(${-wPx / 2}px, ${-hPx / 2}px)`;

        if (img) {
          const radiusPx = (settings.safeRounded / 20) * (Math.min(wPx, hPx) / 2);
          img.style.borderRadius = `${radiusPx}px`;
        }

        orderKeys[i] = key;
        orderScale[i] = tile.bakedScale;
      }

      Array.from(pool.tileEls.keys()).forEach((key) => {
        if (!visibleKeys.has(key)) {
          removeTile(octave, key);
        }
      });

      const sortedIndexes = orderKeys.map((_, index) => index);
      sortedIndexes.sort((a, b) => orderScale[a] - orderScale[b]);

      for (let k = 0; k < sortedIndexes.length; k += 1) {
        const element = pool.tileEls.get(orderKeys[sortedIndexes[k]]);
        if (element) {
          element.style.zIndex = String(layerZBase + k);
        }
      }
    };

    let lastOctaves = new Set();
    const project = () => {
      const octave = Math.floor(values.logZoom);
      const frac = values.logZoom - octave;
      const scaleCurrent = Math.pow(2, frac);
      const scaleNext = Math.pow(2, frac - 1);

      projectLayer(octave, scaleCurrent, 1 - frac, 0, values.camX, values.camY);
      projectLayer(octave + 1, scaleNext, frac, 100000, values.camX, values.camY);

      const nowOctaves = new Set([octave, octave + 1]);
      Array.from(lastOctaves).forEach((octaveKey) => {
        if (!nowOctaves.has(octaveKey)) {
          disposeLayer(octaveKey);
        }
      });
      Array.from(layerPools.keys()).forEach((octaveKey) => {
        if (!nowOctaves.has(octaveKey)) {
          disposeLayer(octaveKey);
        }
      });
      lastOctaves = nowOctaves;
    };

    let frame = 0;
    const loop = () => {
      values.targetX += values.velX;
      values.targetY += values.velY;
      values.velX *= settings.safeFriction;
      values.velY *= settings.safeFriction;

      if (values.velLogZoom !== 0) {
        values.targetLogZoom += values.velLogZoom;
        values.velLogZoom *= settings.safeFriction;
      }

      values.driftX = lerp(values.driftX, values.driftTargetX * settings.safeDriftAmount, 0.08);
      values.driftY = lerp(values.driftY, values.driftTargetY * settings.safeDriftAmount, 0.08);
      values.camX = lerp(values.camX, values.targetX + values.driftX, 0.18);
      values.camY = lerp(values.camY, values.targetY + values.driftY, 0.18);
      values.logZoom = lerp(values.logZoom, values.targetLogZoom, 0.18);

      project();
      frame = window.requestAnimationFrame(loop);
    };

    project();
    frame = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      Array.from(layerPools.keys()).forEach(disposeLayer);
    };
  }, [generateCell, safeImages, settings]);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return undefined;
    }

    const values = valuesRef.current;
    let dragging = false;
    let lastPX = 0;
    let lastPY = 0;
    let lastT = 0;
    let pointerId = null;

    const onDown = (event) => {
      if (event.button !== 0 && event.pointerType === "mouse") {
        return;
      }

      dragging = true;
      pointerId = event.pointerId;
      lastPX = event.clientX;
      lastPY = event.clientY;
      lastT = event.timeStamp;
      values.velX = 0;
      values.velY = 0;

      try {
        element.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture can fail on unsupported inputs.
      }

      element.style.cursor = "grabbing";
    };

    const onMove = (event) => {
      const rect = element.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      values.driftTargetX = clamp(nx, -1, 1);
      values.driftTargetY = clamp(ny, -1, 1);

      if (!dragging || event.pointerId !== pointerId) {
        return;
      }

      const dpx = event.clientX - lastPX;
      const dpy = event.clientY - lastPY;
      const frac = values.logZoom - Math.floor(values.logZoom);
      const effScale = (1 - frac) * Math.pow(2, frac) + frac * Math.pow(2, frac - 1);
      const dWorldX = (-dpx / (INFINITY_PX_PER_UNIT * effScale)) * settings.safeDragSpeed;
      const dWorldY = (-dpy / (INFINITY_PX_PER_UNIT * effScale)) * settings.safeDragSpeed;

      values.targetX += dWorldX;
      values.targetY += dWorldY;

      const dt = Math.max(1, event.timeStamp - lastT);
      const velocityScale = 16 / dt;
      values.velX = dWorldX * velocityScale;
      values.velY = dWorldY * velocityScale;
      lastPX = event.clientX;
      lastPY = event.clientY;
      lastT = event.timeStamp;
    };

    const onUp = (event) => {
      if (!dragging || event.pointerId !== pointerId) {
        return;
      }

      dragging = false;
      pointerId = null;

      try {
        element.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture can already be released.
      }

      element.style.cursor = "grab";
    };

    const onWheel = (event) => {
      event.preventDefault();
      let delta = event.deltaY;

      if (event.deltaMode === 1) {
        delta *= 16;
      } else if (event.deltaMode === 2) {
        delta *= 400;
      }

      values.velLogZoom += -delta * 0.0015 * settings.safeDragSpeed;
    };

    const onLeave = () => {
      values.driftTargetX = 0;
      values.driftTargetY = 0;
    };

    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerup", onUp);
    element.addEventListener("pointercancel", onUp);
    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("pointerleave", onLeave);
    element.style.cursor = "grab";

    return () => {
      element.removeEventListener("pointerdown", onDown);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerup", onUp);
      element.removeEventListener("pointercancel", onUp);
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [settings.safeDragSpeed]);

  return (
    <div
      className="package-infinity-canvas"
      ref={containerRef}
      style={{ backgroundColor }}
      aria-label="包装设计 Infinity Canvas"
    >
      <div className="package-infinity-scene" ref={sceneRef} />
    </div>
  );
}

function PackageCardCanvas({ images }) {
  const stageRef = useRef(null);
  const planeRef = useRef(null);
  const viewRef = useRef({ x: 0, y: 0, scale: 1 });
  const dragRef = useRef({ active: false, pointerId: null, lastX: 0, lastY: 0 });
  const [scale, setScale] = useState(1);

  const tiles = useMemo(() => {
    const columns = 5;
    const columnGap = 266;
    const rowGap = 318;

    return images.map((image, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const centeredColumn = column - (columns - 1) / 2;
      const centeredRow = row - 1.5;

      return {
        ...image,
        x: centeredColumn * columnGap + ((index * 17) % 24) - 12,
        y: centeredRow * rowGap + ((index * 13) % 20) - 10,
        rotation: ((index % 5) - 2) * 0.7,
      };
    });
  }, [images]);

  const applyView = () => {
    const plane = planeRef.current;

    if (!plane) {
      return;
    }

    const { x, y, scale: nextScale } = viewRef.current;
    plane.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${nextScale})`;
  };

  const updateScale = (nextScale) => {
    const clamped = clamp(nextScale, 0.72, 1.9);
    viewRef.current.scale = clamped;
    setScale(clamped);
    applyView();
  };

  const resetView = () => {
    viewRef.current = { x: 0, y: 0, scale: 1 };
    setScale(1);
    applyView();
  };

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return undefined;
    }

    const onPointerDown = (event) => {
      if (event.button !== 0 && event.pointerType === "mouse") {
        return;
      }

      if (event.target.closest?.(".package-canvas-toolbar")) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      dragRef.current = {
        active: true,
        pointerId: event.pointerId,
        lastX: event.clientX,
        lastY: event.clientY,
      };

      try {
        stage.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture can already be owned by the browser.
      }

      stage.style.cursor = "grabbing";
    };

    const onPointerMove = (event) => {
      const drag = dragRef.current;

      if (!drag.active || event.pointerId !== drag.pointerId) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      viewRef.current.x += event.clientX - drag.lastX;
      viewRef.current.y += event.clientY - drag.lastY;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      applyView();
    };

    const onPointerUp = (event) => {
      if (!dragRef.current.active || event.pointerId !== dragRef.current.pointerId) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      dragRef.current.active = false;
      dragRef.current.pointerId = null;

      try {
        stage.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may already be released.
      }

      stage.style.cursor = "grab";
    };

    const onWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
      updateScale(viewRef.current.scale * Math.exp(-event.deltaY * 0.0012));
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.style.cursor = "grab";

    return () => {
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      stage.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div
      className="package-card-canvas"
      ref={stageRef}
      onDoubleClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        resetView();
      }}
      aria-label="包装设计卡片画布"
    >
      <div className="package-canvas-plane" ref={planeRef}>
        {tiles.map((image) => (
          <article
            className="package-canvas-card"
            key={image.image}
            style={{
              "--package-x": `${image.x}px`,
              "--package-y": `${image.y}px`,
              "--package-rotate": `${image.rotation}deg`,
            }}
          >
            <img src={image.image} alt={`${image.label} 包装设计`} draggable={false} />
            <span>{image.number}</span>
            <strong>{image.label}</strong>
          </article>
        ))}
      </div>

      <div className="package-canvas-toolbar" aria-label="画布控制">
        <button type="button" aria-label="缩小" title="缩小" onClick={() => updateScale(viewRef.current.scale - 0.12)}>
          <Minus size={15} />
        </button>
        <span>{Math.round(scale * 100)}%</span>
        <button type="button" aria-label="放大" title="放大" onClick={() => updateScale(viewRef.current.scale + 0.12)}>
          <Plus size={15} />
        </button>
        <button type="button" aria-label="复位画布" title="复位画布" onClick={resetView}>
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}

function PackageDesignModule() {
  if (packageImages.length === 0) {
    return null;
  }

  return (
    <section id="package-design" className="package-design-module" aria-labelledby="package-design-title">
      <div className="package-design-heading">
        <div>
          <span>Package Canvas</span>
          <h2 id="package-design-title">包装设计</h2>
        </div>
        <p>产品视觉延展设计・品牌终端感知强化</p>
      </div>

      <div className="package-canvas-stage" aria-label="包装设计卡片画布">
        <PackageCardCanvas images={packageImages} />
      </div>

      <div className="package-design-footer">
        <div className="package-design-stats">
          {packageStats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModelingRenderingModule() {
  const stageRef = useRef(null);
  const dragRef = useRef({ active: false, pointerId: null, startX: 0, lastX: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(null);
  const activeImage = renderingImages[activeIndex] ?? renderingImages[0];
  const previewImage = previewIndex === null ? null : renderingImages[previewIndex];

  useEffect(() => {
    if (activeIndex >= renderingImages.length) {
      setActiveIndex(0);
    }
  }, [activeIndex]);

  const goTo = (nextIndex) => {
    if (renderingImages.length === 0) {
      return;
    }

    setActiveIndex((currentIndex) => (nextIndex + renderingImages.length) % renderingImages.length);
  };

  const goBy = (delta) => {
    if (renderingImages.length === 0) {
      return;
    }

    setActiveIndex((currentIndex) => (currentIndex + delta + renderingImages.length) % renderingImages.length);
  };

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return undefined;
    }

    const onPointerDown = (event) => {
      if (event.button !== 0 && event.pointerType === "mouse") {
        return;
      }

      if (event.target.closest?.(".modeling-coverflow-toolbar")) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      dragRef.current = {
        active: true,
        pointerId: event.pointerId,
        startX: event.clientX,
        lastX: event.clientX,
      };

      try {
        stage.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture can already be owned elsewhere.
      }

      stage.style.cursor = "grabbing";
    };

    const onPointerMove = (event) => {
      const drag = dragRef.current;

      if (!drag.active || event.pointerId !== drag.pointerId) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      drag.lastX = event.clientX;
    };

    const onPointerUp = (event) => {
      const drag = dragRef.current;

      if (!drag.active || event.pointerId !== drag.pointerId) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      dragRef.current.active = false;
      dragRef.current.pointerId = null;

      try {
        stage.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may already be released.
      }

      stage.style.cursor = "grab";

      const deltaX = event.clientX - drag.startX;
      if (Math.abs(deltaX) > 48) {
        goBy(deltaX < 0 ? 1 : -1);
      }
    };

    const onWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
      goBy(event.deltaY > 0 ? 1 : -1);
    };

    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goBy(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goBy(1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(renderingImages.length - 1);
      } else if (event.key === "Escape") {
        setPreviewIndex(null);
      }
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("keydown", onKeyDown);
    stage.style.cursor = "grab";

    return () => {
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("keydown", onKeyDown);
    };
  }, [renderingImages.length]);

  if (!activeImage) {
    return null;
  }

  return (
    <section id="modeling-rendering" className="modeling-rendering-module" aria-labelledby="modeling-rendering-title">
      <div className="modeling-rendering-heading">
        <div>
          <span>Coverflow Carousel</span>
          <h2 id="modeling-rendering-title">建模渲染</h2>
        </div>
        <p>3D 产品可视化输出・降本替代实景拍摄</p>
      </div>

      <div
        className={`modeling-coverflow-stage ${previewImage ? "is-previewing" : ""}`}
        ref={stageRef}
        tabIndex={0}
        aria-label="建模渲染 Coverflow Carousel"
        onMouseLeave={() => setPreviewIndex(null)}
        onDoubleClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          goTo(0);
          setPreviewIndex(null);
        }}
      >
        <div className="modeling-coverflow-track">
          {renderingImages.map((image, index) => {
            const distance = index - activeIndex;
            const absDistance = Math.abs(distance);
            const isActive = index === activeIndex;
            const hidden = absDistance > 4;

            return (
              <button
                className={`modeling-coverflow-card ${isActive ? "is-active" : ""} ${hidden ? "is-hidden" : ""}`}
                key={image.image}
                type="button"
                aria-current={isActive ? "true" : undefined}
                onClick={() => {
                  goTo(index);
                  setPreviewIndex(index);
                }}
                onFocus={() => goTo(index)}
                onMouseEnter={() => goTo(index)}
                style={{
                  "--coverflow-offset": distance,
                  "--coverflow-x": `${distance * 28}%`,
                  "--coverflow-rotate": `${distance * -32}deg`,
                  "--coverflow-scale": `${Math.max(0.48, 1 - absDistance * 0.12)}`,
                  "--coverflow-opacity": `${Math.max(0, 1 - absDistance * 0.18)}`,
                  "--coverflow-z": `${100 - absDistance}`,
                  "--coverflow-z-depth": `${-absDistance * 140}px`,
                  "--coverflow-blur": `${Math.min(1.2, absDistance * 0.12)}px`,
                  "--coverflow-brightness": `${Math.max(0.72, 1 - absDistance * 0.08)}`,
                }}
              >
                <span className="modeling-coverflow-frame">
                  <img
                    src={image.image}
                    alt={`${image.label} 建模渲染`}
                    draggable={false}
                    loading={isActive ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={isActive ? "high" : "low"}
                  />
                </span>
                <span>{image.number}</span>
                <strong>{image.label}</strong>
              </button>
            );
          })}
        </div>

        {previewImage ? (
          <div className="modeling-coverflow-original" aria-live="polite">
            <figure className="modeling-coverflow-original-frame">
              <img src={previewImage.image} alt={`${previewImage.label} 建模渲染原图`} draggable={false} />
              <figcaption>
                <span>{previewImage.number}</span>
                <strong>{previewImage.label}</strong>
                <em>Original Render</em>
              </figcaption>
            </figure>
          </div>
        ) : null}

        <div className="modeling-coverflow-panel">
          <div className="modeling-coverflow-meta">
            <span>Coverflow Carousel</span>
            <strong>{activeImage.label}</strong>
          </div>

          <div className="modeling-coverflow-toolbar" aria-label="建模渲染控制">
            <button type="button" aria-label="上一张" title="上一张" onClick={() => goBy(-1)}>
              <ChevronLeft size={16} />
            </button>
            <span>
              {String(activeIndex + 1).padStart(2, "0")} / {String(renderingImages.length).padStart(2, "0")}
            </span>
            <button type="button" aria-label="下一张" title="下一张" onClick={() => goBy(1)}>
              <ChevronRight size={16} />
            </button>
            <button type="button" aria-label="复位" title="复位" onClick={() => goTo(0)}>
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="modeling-rendering-footer">
        <div className="modeling-rendering-stats">
          {renderingStats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MainSkuDetailModule() {
  const [activeVisual, setActiveVisual] = useState(mainVisualImages[0]);
  const featuredVisuals = mainVisualImages.slice(0, 8);
  const featuredSkus = skuImages.slice(0, 7);
  const hasDetailImages = detailImages.length > 0;

  if (!activeVisual) {
    return null;
  }

  const activateVisual = (visual) => {
    setActiveVisual(visual);
  };

  const moveCardLight = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    event.currentTarget.style.setProperty("--pointer-x", `${x}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${y}%`);
  };

  return (
    <section id="main-sku-detail" className="main-sku-module" aria-labelledby="main-sku-title">
      <div className="main-sku-heading">
        <div>
          <span>Custom Spaces</span>
          <h2 id="main-sku-title">主图 SKU 详情</h2>
        </div>
        <p>商品转化视觉优化・详情页逻辑全案策划</p>
      </div>

      <div className="main-sku-layout">
        <article className="main-sku-focus">
          <div className="main-sku-focus-image">
            <img key={activeVisual.image} src={activeVisual.image} alt={`${activeVisual.label} 主图预览`} />
          </div>
          <div className="main-sku-focus-meta">
            <span>{activeVisual.number}</span>
            <strong>{activeVisual.label}</strong>
            <em>Main Visual Focus</em>
          </div>
        </article>

        <div className="main-sku-space" aria-label="主图作品空间">
          {featuredVisuals.map((visual, index) => (
            <button
              className={`main-sku-card main-sku-card-${index + 1} ${
                activeVisual.image === visual.image ? "is-active" : ""
              }`}
              key={visual.image}
              onClick={() => activateVisual(visual)}
              onFocus={() => activateVisual(visual)}
              onMouseEnter={() => activateVisual(visual)}
              onMouseMove={moveCardLight}
              type="button"
            >
              <img src={visual.image} alt={`${visual.label} 主图设计`} />
              <span>{visual.number}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="main-sku-footer">
        <div className="main-sku-stats">
          {mainSkuStats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {featuredSkus.length > 0 ? (
          <div className="sku-strip" aria-label="SKU 图片">
            {featuredSkus.map((sku) => (
              <button
                className="sku-strip-card"
                key={sku.image}
                onClick={() => activateVisual(sku)}
                onFocus={() => activateVisual(sku)}
                onMouseEnter={() => activateVisual(sku)}
                type="button"
              >
                <img src={sku.image} alt={`${sku.label} SKU 图片`} />
                <span>{sku.number}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {hasDetailImages ? <DetailMagneticCarousel images={detailImages} /> : null}
    </section>
  );
}

function DetailMagneticCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const defaultItemSize = { width: 150, height: 680 };
  const hoverItemSize = { width: 286, height: 760 };
  const influenceRadius = 280;
  const carouselRef = useRef(null);
  const rowRef = useRef(null);
  const itemRefs = useRef([]);
  const itemCenterRefs = useRef([]);
  const rowLeftRef = useRef(0);
  const imageWindowRefs = useRef([]);
  const frameRef = useRef(null);
  const pendingClientXRef = useRef(0);
  const closeModeRef = useRef("default");
  const pointerStateRef = useRef({ isInsideRow: false, clientX: 0 });

  const applyItemTransform = (item, proximity = 0) => {
    if (!item) {
      return;
    }

    const smooth = proximity * proximity * (3 - 2 * proximity);
    const scaleX = 1 + ((hoverItemSize.width - defaultItemSize.width) / defaultItemSize.width) * smooth;
    const scaleY = 1 + ((hoverItemSize.height - defaultItemSize.height) / defaultItemSize.height) * smooth;

    item.style.setProperty("--detail-scale-x", scaleX.toFixed(4));
    item.style.setProperty("--detail-scale-y", scaleY.toFixed(4));
    item.style.setProperty("--detail-lift", `${(-8 * smooth).toFixed(2)}px`);
    item.style.zIndex = smooth > 0.12 ? String(Math.round(2 + smooth * 8)) : "";
  };

  const measureItemCenters = () => {
    const row = rowRef.current;

    if (!row) {
      itemCenterRefs.current = [];
      rowLeftRef.current = 0;
      return;
    }

    rowLeftRef.current = row.getBoundingClientRect().left;
    itemCenterRefs.current = itemRefs.current.map((item) =>
      item ? item.offsetLeft + item.offsetWidth / 2 : null,
    );
  };

  const setDefaultTargets = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    itemRefs.current.forEach((item) => applyItemTransform(item));
  };

  const resetImageScrollPositions = () => {
    imageWindowRefs.current.forEach((imageWindow) => {
      if (imageWindow) {
        imageWindow.scrollTop = 0;
      }
    });
  };

  const applyMagneticTargets = (clientX) => {
    frameRef.current = null;
    const row = rowRef.current;

    if (!row) {
      return;
    }

    const pointerX = clientX - rowLeftRef.current + row.scrollLeft;

    itemRefs.current.forEach((item, index) => {
      if (!item) {
        return;
      }

      const center = itemCenterRefs.current[index];

      if (center === null || center === undefined) {
        applyItemTransform(item);
        return;
      }

      const distance = Math.abs(pointerX - center);
      const proximity = Math.max(0, 1 - distance / influenceRadius);
      applyItemTransform(item, proximity);
    });
  };

  const updateMagneticTargets = (clientX) => {
    pendingClientXRef.current = clientX;

    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(() => applyMagneticTargets(pendingClientXRef.current));
    }
  };

  const restoreRowInteraction = () => {
    if (pointerStateRef.current.isInsideRow) {
      updateMagneticTargets(pointerStateRef.current.clientX);
      return;
    }

    setDefaultTargets();
  };

  const resetCarousel = ({ restoreInteraction = false } = {}) => {
    closeModeRef.current = restoreInteraction ? "restore" : "default";
    setActiveIndex(null);
    resetImageScrollPositions();

    if (activeIndex === null) {
      if (restoreInteraction) {
        restoreRowInteraction();
        return;
      }

      setDefaultTargets();
    }
  };

  useEffect(() => {
    if (activeIndex === null) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        resetCarousel();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      itemRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex !== null) {
      setDefaultTargets();
      return undefined;
    }

    const mode = closeModeRef.current;
    closeModeRef.current = "default";

    const frame = window.requestAnimationFrame(() => {
      if (mode === "restore") {
        restoreRowInteraction();
        return;
      }

      setDefaultTargets();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, images.length]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    },
    [],
  );

  const selectImage = (index) => {
    if (activeIndex === index) {
      resetCarousel({ restoreInteraction: true });
      return;
    }

    closeModeRef.current = "default";
    resetImageScrollPositions();
    setDefaultTargets();
    setActiveIndex(index);
  };

  const handleMagneticMove = (event) => {
    pointerStateRef.current = { isInsideRow: true, clientX: event.clientX };

    if (activeIndex !== null) {
      return;
    }

    updateMagneticTargets(event.clientX);
  };

  const resetMagneticTargets = () => {
    if (activeIndex === null) {
      setDefaultTargets();
    }
  };

  const handleRowWheel = (event) => {
    if (activeIndex !== null) {
      return;
    }

    const row = rowRef.current;

    if (!row || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    event.preventDefault();
    row.scrollLeft += event.deltaY;
  };

  return (
    <div
      className="detail-magnetic-carousel"
      aria-labelledby="detail-carousel-title"
      ref={carouselRef}
      onMouseLeave={resetCarousel}
    >
      <div className="detail-carousel-heading">
        <div>
          <span>Magnetic Carousel</span>
          <h3 id="detail-carousel-title">详情页图片磁吸画廊</h3>
        </div>
      </div>

      <div className="detail-carousel-stage">
        <div
          className={`detail-carousel-row ${activeIndex !== null ? "is-open" : ""}`}
          ref={rowRef}
          onPointerEnter={(event) => {
            measureItemCenters();
            handleMagneticMove(event);
          }}
          onPointerMove={handleMagneticMove}
          onPointerLeave={() => {
            pointerStateRef.current = { ...pointerStateRef.current, isInsideRow: false };

            if (activeIndex !== null) {
              resetCarousel();
              return;
            }

            resetMagneticTargets();
          }}
          onScroll={() => {
            if (activeIndex === null && pointerStateRef.current.isInsideRow) {
              updateMagneticTargets(pointerStateRef.current.clientX);
            }
          }}
          onWheel={handleRowWheel}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              resetCarousel();
            }
          }}
          aria-label="详情页图片横向画廊"
        >
          {images.map((image, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                className={`detail-carousel-item ${isActive ? "is-open" : ""} ${
                  activeIndex !== null && !isActive ? "is-dimmed" : ""
                }`}
                key={image.image}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                type="button"
                aria-expanded={isActive}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  selectImage(index);
                }}
              >
                <span
                  className="detail-image-window"
                  ref={(element) => {
                    imageWindowRefs.current[index] = element;
                  }}
                >
                  <img
                    src={isActive ? image.image : image.preview}
                    fetchPriority={isActive ? "high" : "low"}
                    alt={`${image.label} 详情页图片`}
                    decoding="async"
                    draggable={false}
                    loading={isActive ? "eager" : "lazy"}
                  />
                </span>
                <span>{image.number}</span>
                <strong>{image.label}</strong>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Strengths() {
  return (
    <section id="strengths" className="section strengths-section">
      <div className="section-heading">
        <span>03 / Capability</span>
        <h2>个人优势</h2>
      </div>
      <div className="strength-grid">
        {strengths.map((item) => (
          <article className="strength-card" key={item.title}>
            <div className="strength-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-bg-text">Available</div>
      <div className="contact-inner">
        <span className="eyebrow contact-eyebrow">
          <span />
          Let's build next visual system
        </span>
        <h2>期待与你讨论下一个品牌视觉、AI 设计或电商项目。</h2>
        <div className="contact-actions">
          <a href={`mailto:${profile.email}`}>
            <Mail size={20} />
            {profile.email}
          </a>
          <span>
            <MessageCircle size={20} />
            WeChat: {profile.wechat}
          </span>
        </div>
        <div className="footer-qr-card">
          <img src={assets.qr} alt="微信二维码" loading="lazy" decoding="async" />
          <div className="footer-qr-copy">
            <span>WeChat QR Code</span>
            <strong>扫码添加微信</strong>
            <em>{profile.wechat}</em>
          </div>
        </div>
      </div>
    </section>
  );
}

function usePageMotion() {
  useEffect(() => {
    const revealSelector = [
      ".section-heading",
      ".resume-panel",
      ".resume-block",
      ".contents-panel",
      ".content-item",
      ".poster-design-module",
      ".home-banner-module",
      ".vi-design-module",
      ".package-design-module",
      ".modeling-rendering-module",
      ".main-sku-module",
      ".aigc-video-module",
      ".strength-card",
      ".contact-inner",
      ".stat-card",
      ".skill-icon-card",
      ".timeline-item",
      ".aigc-video-stats > div",
      ".aigc-main-video-card",
      ".aigc-douyin-card",
      ".contact-actions > *",
      ".footer-qr-card",
    ].join(", ");
    const hoverSelector = [
      ".content-item",
      ".stat-card",
      ".skill-icon-card",
      ".strength-card",
      ".aigc-video-stats > div",
      ".aigc-main-video-card",
      ".aigc-douyin-card",
      ".qr-card",
      ".footer-qr-card",
      ".contact-actions > a",
      ".contact-actions > span",
      ".primary-link",
      ".header-cta",
    ].join(", ");
    const revealItems = Array.from(document.querySelectorAll(revealSelector));
    const hoverItems = Array.from(document.querySelectorAll(hoverSelector));
    let revealObserver;

    revealItems.forEach((element, index) => {
      element.classList.add("motion-reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 8, 7) * 55}ms`);
    });

    const revealFrame = window.requestAnimationFrame(() => {
      if (!("IntersectionObserver" in window)) {
        revealItems.forEach((element) => element.classList.add("is-visible"));
        return;
      }

      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -8% 0px",
        },
      );

      revealItems.forEach((element) => revealObserver.observe(element));
    });

    const pointerHandlers = hoverItems.map((element) => {
      const handlePointerMove = (event) => {
        if (event.pointerType === "touch") {
          return;
        }

        const rect = element.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        const rotateX = ((50 - y) / 50) * 3.5;
        const rotateY = ((x - 50) / 50) * 3.5;

        element.style.setProperty("--pointer-x", `${x}%`);
        element.style.setProperty("--pointer-y", `${y}%`);
        element.style.setProperty("--tilt-x", `${rotateX}deg`);
        element.style.setProperty("--tilt-y", `${rotateY}deg`);
        element.classList.add("is-pointer-active");
      };
      const resetPointer = () => {
        element.classList.remove("is-pointer-active");
        element.style.removeProperty("--tilt-x");
        element.style.removeProperty("--tilt-y");
      };

      element.addEventListener("pointermove", handlePointerMove);
      element.addEventListener("pointerleave", resetPointer);

      return { element, handlePointerMove, resetPointer };
    });

    return () => {
      window.cancelAnimationFrame(revealFrame);
      revealObserver?.disconnect();

      pointerHandlers.forEach(({ element, handlePointerMove, resetPointer }) => {
        element.removeEventListener("pointermove", handlePointerMove);
        element.removeEventListener("pointerleave", resetPointer);
      });
    };
  }, []);
}

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.65);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <button
      className={`back-to-top ${isVisible ? "is-visible" : ""}`}
      type="button"
      aria-label="回到顶部"
      title="回到顶部"
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
    >
      <ArrowUp size={18} />
    </button>
  );
}

function App() {
  usePageMotion();

  useEffect(() => {
    if (!initialHash) {
      return undefined;
    }

    const resetToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    resetToTop();
    const frame = window.requestAnimationFrame(resetToTop);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Hero />
      <main>
        <About />
        <Projects />
        <Strengths />
        <Contact />
      </main>
      <BackToTopButton />
    </>
  );
}

const rootElement = document.getElementById("root");
const root = globalThis.__portfolioRoot ?? createRoot(rootElement);
globalThis.__portfolioRoot = root;
root.render(<App />);
