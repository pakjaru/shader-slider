import { disp8, Img21, Img22 } from "./assets"
import { HoverEffect } from "./components"

function App() {
	return (
		<>
			<HoverEffect image1={Img22} image2={Img21} disp={disp8} />
		</>
	)
}

export default App
