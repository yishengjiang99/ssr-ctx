import { METHODS } from "http";

export const t=()=>{
	const hz = [440.0, 466.16, 493.88, 523.25, 554.37];
	const logx= [0x0001, 0x0010, 0x0100];


	const freq =(n)=>{
		const f = Math.pow(2, n/12) * 440;
		/**
		 * 
		 * 
		 *    f = 2^(n/12)*440
		 * 	   log f - log 440 = n/12
		 * 		
		 * 
		 */


	}