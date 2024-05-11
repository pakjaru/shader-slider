import { RefObject } from "react"
import * as THREE from "three"

import { lndscp1, lndscp2 } from "../../assets"

import vertexShader from "./vertex"
import fragmentShader from "./fragment"
import gsap from "gsap"

export const initShader = (elRef: RefObject<HTMLCanvasElement>) => {
	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	}

	// Canvas
	const canvas = elRef.current

	// Textures
	const textureLoader = new THREE.TextureLoader()
	const textureOne = textureLoader.load(lndscp1)
	const textureTwo = textureLoader.load(lndscp2)

	// Scene
	const scene = new THREE.Scene()

	// Material
	const geometry = new THREE.PlaneGeometry(sizes.width, sizes.height)
	const material = new THREE.ShaderMaterial({
		vertexShader,
		fragmentShader,
		uniforms: {
			uTextureOne: { value: textureOne },
			uTextureTwo: { value: textureTwo },
			uProgress: { value: 0 },
		},
	})

	// Mesh
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.z = -1
	scene.add(mesh)

	// Camera
	const camera = new THREE.OrthographicCamera(
		-sizes.width / 2,
		sizes.width / 2,
		sizes.height / 2,
		-sizes.height / 2,
		0.1,
		Math.max(sizes.width, sizes.height),
	)
	camera.lookAt(mesh.position)

	// Renderer
	const renderer = new THREE.WebGLRenderer({ canvas })
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	gsap.fromTo(material.uniforms.uProgress, { value: 0 }, { value: 1, duration: 3 })

	window.addEventListener("resize", () => {
		// Update sizes
		sizes.width = window.innerWidth
		sizes.height = window.innerHeight

		// Update camera
		camera.left = -sizes.width / 2
		camera.right = sizes.width / 2
		camera.top = sizes.height / 2
		camera.bottom = -sizes.height / 2
		camera.updateProjectionMatrix()
		camera.lookAt(mesh.position)

		// Update renderer
		renderer.setSize(sizes.width, sizes.height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	})

	const tick = () => {
		// Render
		renderer.render(scene, camera)

		// Call tick again on the next frame
		window.requestAnimationFrame(tick)
	}

	tick()
}
