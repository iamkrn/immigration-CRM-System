const Footer = () => {
  return (
    <div className="px-6 py-3 flex justify-between items-center text-xs"
      style={{
        background: "rgba(255,255,255,0.95)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        color: "#94a3b8"
      }}>

      <span>© 2026 <strong style={{ color: "#3b82f6" }}>360 College Review</strong> • All rights reserved</span>

      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
        <span>All systems operational</span>
      </div>

    </div>
  );
};

export default Footer;