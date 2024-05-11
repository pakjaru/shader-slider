import { FC, useEffect, useRef, useState } from "react"
import { initShader } from "./shader"

export interface Props {
	image1: string
	image2: string
	disp: string
}

export const HoverEffect: FC<Props> = ({ image1, image2, disp }) => {
	const elRef = useRef<HTMLDivElement>(null)

	const [init, setInit] = useState<boolean>(false)

	useEffect(() => {
		if (!window || init) return

		console.log("hit")

		initShader({ elRef, image1, image2, disp })
		setInit(true)
	}, [])

	return (
		<section className='flex h-screen w-screen'>
			<div className='h-full w-1/2 bg-red-600'></div>
			<div ref={elRef} className='h-full w-1/2'></div>
		</section>
	)
}
