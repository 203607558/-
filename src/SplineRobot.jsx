import { useEffect, useRef, useState } from "react";

const scheduleIdleTask = (callback) => {
  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, { timeout: 900 });
  }

  return window.setTimeout(callback, 120);
};

const cancelIdleTask = (taskId) => {
  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(taskId);
    return;
  }

  window.clearTimeout(taskId);
};

export default function SplineRobot() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function startSpline() {
      try {
        if (cancelled || !canvasRef.current) return;

        const [{ Application }, { nexbotSceneData }] = await Promise.all([
          import("@splinetool/runtime"),
          import("./nexbotSceneData"),
        ]);

        if (cancelled || !canvasRef.current) return;

        const app = new Application(canvasRef.current);
        appRef.current = app;
        await app.start(nexbotSceneData);

        if (!cancelled) {
          setStatus("ready");
        }
      } catch (error) {
        console.error("Spline robot failed to load", error);
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    const idleTask = scheduleIdleTask(startSpline);

    return () => {
      cancelled = true;
      cancelIdleTask(idleTask);
      const app = appRef.current;
      appRef.current = null;

      if (app && typeof app.dispose === "function") {
        app.dispose();
      } else if (app && typeof app.stop === "function") {
        app.stop();
      }
    };
  }, []);

  return (
    <div className={`spline-robot spline-robot-${status}`}>
      <canvas ref={canvasRef} className="spline-robot-canvas" aria-label="Interactive 3D robot" />
      <div className="spline-robot-fallback" aria-hidden="true" />
    </div>
  );
}
