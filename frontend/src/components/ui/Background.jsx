function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-base-950">
      {/* animated mesh gradient wash */}
      <div className="absolute inset-0 bg-mesh-gradient bg-200% animate-gradientShift" />

      {/* floating 3D-ish blobs */}
      <div className="absolute -top-32 -left-24 w-[32rem] h-[32rem] rounded-full bg-indigo-500/30 blur-[110px] animate-blobFloatA" />
      <div className="absolute top-1/3 -right-32 w-[36rem] h-[36rem] rounded-full bg-violet-500/25 blur-[120px] animate-blobFloatB" />
      <div className="absolute bottom-[-10rem] left-1/4 w-[30rem] h-[30rem] rounded-full bg-azure-500/20 blur-[110px] animate-blobFloatC" />

      {/* subtle grain / vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,8,15,0.6)_100%)]" />

      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  )
}

export default Background
