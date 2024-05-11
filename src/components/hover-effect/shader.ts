import { RefObject } from "react"
import * as THREE from "three"
import gsap from "gsap"

import { Props as ComponentProps } from "./hover-effect"

import vertex from "./vertex"
import fragment from "./fragment"

interface Props extends ComponentProps {
	elRef: RefObject<HTMLDivElement>
}

export const initShader = ({ elRef, image1, image2, disp }: Props) => {
	// Canvas
	const canvas = elRef.current

	if (!canvas) {
		console.warn("Parent missing")
		return
	}

	if (!(image1 && image2 && disp)) {
		console.warn("One or more images are missing")
		return
	}

	// Scene
	const scene = new THREE.Scene()

	// Camera
	const camera = new THREE.OrthographicCamera(
		canvas?.offsetWidth / -2,
		canvas?.offsetWidth / 2,
		canvas?.offsetHeight / 2,
		canvas?.offsetHeight / -2,
		1,
		1000,
	)

	camera.position.z = 1

	// Renderer
	const renderer = new THREE.WebGLRenderer({
		antialias: false,
		alpha: true,
	})

	renderer.setPixelRatio(2.0)
	renderer.setClearColor(0xffffff, 0.0)
	renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
	canvas.appendChild(renderer.domElement)

	const render = () => {
		renderer.render(scene, camera)
	}

	// Loader
	const loader = new THREE.TextureLoader()
	loader.crossOrigin = ""

	// Displacement Loader
	const dispImage = loader.load(disp, render)
	dispImage.magFilter = dispImage.minFilter = THREE.LinearFilter

	// Images Loader
	const texture1 = loader.load(image1, render)
	const texture2 = loader.load(image2, render)

	texture1.magFilter = texture2.magFilter = THREE.LinearFilter
	texture1.minFilter = texture2.minFilter = THREE.LinearFilter

	//
	let a1, a2
	const imageAspect = 1
	if (canvas.offsetHeight / canvas.offsetWidth < imageAspect) {
		a1 = 1
		a2 = canvas.offsetHeight / canvas.offsetWidth / imageAspect
	} else {
		a1 = (canvas.offsetWidth / canvas.offsetHeight) * imageAspect
		a2 = 1
	}

	// Material
	const mat = new THREE.ShaderMaterial({
		uniforms: {
			intensity1: {
				value: -0.85,
			},
			intensity2: {
				value: -0.85,
			},
			dispFactor: {
				value: 0.0,
			},
			angle1: {
				value: Math.PI / 4,
			},
			angle2: {
				value: -(Math.PI / 4) * 3,
			},
			texture1: {
				value: texture1,
			},
			texture2: {
				value: texture2,
			},
			disp: {
				value: dispImage,
			},
			res: {
				value: new THREE.Vector4(canvas.offsetWidth, canvas.offsetHeight, a1, a2),
			},
			dpr: {
				value: window.devicePixelRatio,
			},
		},

		vertexShader: vertex,
		fragmentShader: fragment,
		transparent: true,
		opacity: 1.0,
	})

	const geometry = new THREE.PlaneGeometry(canvas.offsetWidth, canvas.offsetHeight, 1)
	const object = new THREE.Mesh(geometry, mat)
	scene.add(object)

	const transitionIn = () => {
		gsap.to(mat.uniforms.dispFactor, {
			duration: 1.2,
			value: 1,
			ease: "expo.out",
			onUpdate: render,
			onComplete: render,
		})
	}

	const transitionOut = () => {
		gsap.to(mat.uniforms.dispFactor, {
			duration: 1.2,
			value: 0,
			ease: "expo.out",
			onUpdate: render,
			onComplete: render,
		})
	}

	canvas.addEventListener("mouseenter", transitionIn)
	canvas.addEventListener("touchstart", transitionIn)
	canvas.addEventListener("mouseleave", transitionOut)
	canvas.addEventListener("touchend", transitionOut)

	window.addEventListener("resize", () => {
		if (canvas.offsetHeight / canvas.offsetWidth < imageAspect) {
			a1 = 1
			a2 = canvas.offsetHeight / canvas.offsetWidth / imageAspect
		} else {
			a1 = (canvas.offsetWidth / canvas.offsetHeight) * imageAspect
			a2 = 1
		}
		object.material.uniforms.res.value = new THREE.Vector4(canvas.offsetWidth, canvas.offsetHeight, a1, a2)
		renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

		render()
	})
}
