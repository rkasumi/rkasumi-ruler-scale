Hooks.on("init", () => {
  game.settings.register("rkasumi-ruler-scale", "scaling", {
    name: "Ruler Scale",
    scope: "client",
    config: true,
    default: 100,
    type: Number,
  });
})

Hooks.once('init', async function () {
    libWrapper.register('rkasumi-ruler-scale', "Ruler.prototype._drawMeasuredPath", rkasumiRulerScale, "OVERRIDE")
});

function rkasumiRulerScale() {
    const r = this.ruler.beginFill(this.color, 0.25);
    for ( const segment of this.segments ) {
      const {ray, distance, label, last} = segment;
      if ( distance === 0 ) continue;

      // Draw Line
      r.moveTo(ray.A.x, ray.A.y).lineStyle(6, 0x000000, 0.5).lineTo(ray.B.x, ray.B.y)
        .lineStyle(4, this.color, 0.25).moveTo(ray.A.x, ray.A.y).lineTo(ray.B.x, ray.B.y);

      // Draw Waypoints
      r.lineStyle(2, 0x000000, 0.5).drawCircle(ray.A.x, ray.A.y, 8);
      if ( last ) r.drawCircle(ray.B.x, ray.B.y, 8);

      // Draw Label
      if ( label ) {
        const text = this._getSegmentLabel(segment, this.totalDistance);
        if ( text ) {
          label.text = text;
          label.alpha = last ? 1.0 : 0.5;
          label.visible = true;
          let labelPosition = ray.project((ray.distance + 50) / ray.distance);
          label.position.set(labelPosition.x, labelPosition.y);

          let scale = game.settings.get("rkasumi-ruler-scale", "scaling")
          let gs = (canvas.scene.dimensions.size /100) 
          let zs = 1/canvas.stage.scale.x
          label.transform.scale.set((gs+zs) * (scale/100))
        }
        else label.visible = false;
      }
    }
    r.endFill();
}
