import { FC, useEffect, useRef, useState } from "react"

import "./Shader"
import { initShader } from "./Shader"

export const Slider: FC = () => {
	const elRef = useRef<HTMLCanvasElement>(null)

	const [index, setIndex] = useState<number>(0)

	const prevButtonClick = () => {
		if (index === 0) return setIndex(4)

		setIndex(index - 1)
	}

	const nextButtonClick = () => {
		if (index === 4) return setIndex(0)

		setIndex(index + 1)
	}

	useEffect(() => {
		if (!window) return

		initShader(elRef)
	}, [])

	return (
		<section className='relative h-screen w-screen'>
			<canvas ref={elRef} />

			<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
				<div className='flex flex-col items-center justify-center gap-5'>
					<div className='text-5xl font-bold text-white'>{index + 1}</div>
					<div className='flex gap-10 text-white'>
						<button onClick={prevButtonClick}>prev</button>
						<span>/</span>
						<button onClick={nextButtonClick}>next</button>
					</div>
				</div>
			</div>
		</section>
	)
}
