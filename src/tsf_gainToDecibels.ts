import { ChildProcess, spawn } from "child_process";

export const tsf_gainToDecibels = (gain: number) => gain <= 0.0001 ? -100 : (20.0 * Math.log(gain));
export const tsf_decibelsToGain = (db: number) => db > -100.0 ? Math.pow(10, db * 0.05) : 0;
export const scatter_plot = (func: (x: number) => number, xs: number[], pngName: string = 'plot.png') => {
	let minx: number, maxx: number, miny: number, maxy: number, ys: number[] = []; //: { [x: string]: any; }
	for (const i in xs)
	{
		ys[i] = Math.log(func(xs[i]));
		minx = Math.min(xs[i], minx || xs[i]);

		maxx = Math.max(xs[i], maxx || xs[i]);
		miny = Math.min(ys[i], miny || ys[i]);
		maxy = Math.max(ys[i], maxy || ys[i]);

	}
	const yrange = Math.floor(maxy - miny) * 10;
	console.log(ys, yrange);
	const pixels = new Uint8Array(yrange * (maxx - minx)).fill(0x00);
	const xrange = maxx - minx;
	for (const i in xs)
	{
		const p = ys[i] * (maxx - minx) + (xs[i] - minx);
		pixels[p] = 255;
	}
	console.log(pixels.toString(), xs, `ffmpeg -f rawvideo -pixel_format monob -i pipe:0 -video_size ${xrange}x${yrange}  -f mp4 ./vid.mp4`);
	cspawn(`ffmpeg -f rawvideo -pixel_format monob -i pipe:0 -video_size ${xrange}x${yrange}  -f mp4 ./vid.mp4`).stdin.write(pixels.join(""));

};
export const cspawn = (str): ChildProcess => {
	const t = str.split(' ');
	const p = spawn(t.shift(), t);
	p.stderr.setEncoding("utf-8");
	p.stdout.on('error', console.error);
	p.stderr.on('data', console.error);

	return p;
};
