let container, sceneWidth, sceneHeight, scene, camera, renderer, controls, group, cv3d;

const init = (suelos, datosIniciales) => {
	
	if (!suelos || !datosIniciales) {
		
		const suelosPredeterminados = [{
			espesor: "2",
			color: '#795548'
		}, 
		{
			espesor: "2.8",
			color: '#ff9800'
		}, 
		{
			espesor: "2.2",
			color: '#7f2b11'
		}]
		
		const datosInicialesPredeterminados = {
			b: 5,
			df: 4.2,
			l: 5,
			nf: 4.8,
		}
		createScene(suelosPredeterminados, datosInicialesPredeterminados);
		
		update();
	} else {
		const divCanvas = document.querySelector('#canvas3d')
		divCanvas.removeChild(divCanvas.firstElementChild)
		cleanScene(scene)
		createScene(suelos, datosIniciales);
		update();
	}
}

const createScene = (suelos, datosIniciales) => {

	// Datos para graficar Zapata
	const b = datosIniciales.b
	const l = datosIniciales.l
	const df = datosIniciales.df
	const nf = datosIniciales.nf

	// Datos para graficar suelos

	const espesoresEstratos = suelos.forEach(suelo => parseFloat(suelo.espesor))

	// Dimensiones del espacio de dibujo 3D
	sceneWidth = 600;
	sceneHeight = 480;

	// Escena
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffffff);

	// Render
	renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(sceneWidth, sceneHeight);

	//Container - canvas
	container = document.querySelector('#canvas3d');
	container.appendChild(renderer.domElement);

	//Camera OJO CUADRAR CÁMARA
	camera = new THREE.PerspectiveCamera(45, sceneWidth / sceneHeight, 1, 1000);
	camera.position.set(15, 15, 15);

	//Light OJO CUADRAR LUZ
	const light = new THREE.DirectionalLight(0xffffff);
	light.position.set(-20, 5, -20)
	scene.add(light)

	const light2 = new THREE.DirectionalLight(0xffffff);
	light2.position.set(20, 5, 20)
	scene.add(light2)

	//OrbitControls
	controls = new THREE.OrbitControls(camera, renderer.domElement)
	controls.update();

	//Groups
	group = new THREE.Group()

	//Crear Zapata
	// RECORDEMOS X, Z, Y
	renderZapata(df, l, b)

	// Crear plano de NF
	renderNF(nf)

	//Graficar estratos
	let cota = 0
	suelos.forEach((suelo) => {
		let esp = parseFloat(suelo.espesor)
		let r = parseInt(suelo.color.slice(1, 3), 16)
		let g = parseInt(suelo.color.slice(3, 5), 16)
		let b = parseInt(suelo.color.slice(5, 7), 16)
		let color = [r, g, b]
		
		renderEstrato(esp, color, -esp/2 - cota)
		cota = cota + esp
	})

	//Graficar rocoso
	renderEstrato(1, [0, 0, 0], -1/2 - cota)

	group.translateY(1.2 * nf)
	scene.add(group)
}

const update = () => {
	requestAnimationFrame(update);
	render();
}

const render = () => {
	controls.update();
	renderer.render(scene, camera);
	cv3d = renderer.domElement.toDataURL('image/png');
	
}

const renderZapata = (df, l, b) => {
	// Columna
	let columna =  new THREE.BoxGeometry(l/4, df, l/4);
	let columnaMaterial = new THREE.MeshPhongMaterial({color: 0xa8a3a3})
	columna.translate(0, -df/2, 0)
    let meshColumna = new THREE.Mesh(columna, columnaMaterial)
	group.add(meshColumna)
	//scene.add(meshColumna)

	const edgesColumna = new THREE.EdgesGeometry( columna );
	const lineColumna = new THREE.LineSegments( edgesColumna, new THREE.LineBasicMaterial( { 
		color: 0x000000,
		linewidth: 0.3
	} ) );
	group.add(lineColumna)
	//scene.add(lineColumna)

	// Plancha
	let plancha =  new THREE.BoxGeometry(l, df/3, b);
	let planchaMaterial = new THREE.MeshPhongMaterial({color: 0xa8a3a3})
	plancha.translate(0, -df + df/6, 0)
    let meshPlancha = new THREE.Mesh(plancha, planchaMaterial)
	group.add(meshPlancha)
	//scene.add(meshPlancha)

	const edgesPlancha = new THREE.EdgesGeometry( plancha );
	const linePlancha = new THREE.LineSegments( edgesPlancha, new THREE.LineBasicMaterial( { 
		color: 0x000000,
		linewidth: 0.3
	} ) );
	group.add(linePlancha)
	//scene.add(linePlancha)
}

const renderNF = (nf) => {
	let nivelFreatico = new THREE.PlaneGeometry(12, 12, 32)
	let nivelFreaticoMaterial = new THREE.MeshPhongMaterial({
		color: 0x000dff,
		opacity: 0.9,
		transparent: false,
		side: THREE.DoubleSide
	})
	nivelFreatico.translate(0, 0, nf)
	nivelFreatico.rotateY(Math.PI/2)
	nivelFreatico.rotateZ(-Math.PI/2)
	let meshFreactico = new THREE.Mesh(nivelFreatico, nivelFreaticoMaterial)
	group.add(meshFreactico)
	//scene.add(meshFreactico)

	const edgesNF = new THREE.EdgesGeometry( nivelFreatico );
	const lineNF = new THREE.LineSegments( edgesNF, new THREE.LineBasicMaterial( { 
		color: 0x000000,
		linewidth: 0.3 } ) );
	group.add(lineNF)
	//scene.add(lineNF)
}

const renderEstrato = (espesor, color, desp) => {
	const [r, g, b] = color
	
	let estrato =  new THREE.BoxGeometry(10, espesor, 10);
	let estratoMaterial = new THREE.MeshPhongMaterial({
		color: new THREE.Color(`rgb(${r}, ${g}, ${b})`),
		opacity: 0.7,
		transparent: true
	})
	
	estrato.translate(0, desp, 0)
    let meshEstrato = new THREE.Mesh(estrato, estratoMaterial)
	group.add(meshEstrato)
	//scene.add(meshEstrato)

	const edgesEstrato = new THREE.EdgesGeometry( estrato );
	const lineEstrato = new THREE.LineSegments( edgesEstrato, new THREE.LineBasicMaterial( { 
		color: 0x000000,
		linewidth: 0.3
	 } ) );
	group.add(lineEstrato)
	//scene.add(lineEstrato)
}

const cleanScene = (esceneObject) => {
	
	const childsEscene = esceneObject.children
	while (childsEscene.length > 0) {
		esceneObject.remove(childsEscene[0])
	}
}

/* function init() {

    const container = document.querySelector('#canvas3d')

    const windowWidth = 600
    const windowHeight = 480

	const aspect = windowWidth / windowHeight;
	camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );

	camera.position.set( - 200, 200, 200 );

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xf0f0f0);

	const geometry = new THREE.BoxGeometry(50, 200, 50)
	const material = new THREE.MeshBasicMaterial({ color: 0xcc0000})
	const mesh = new THREE.Mesh(geometry, material)
	const scene = new THREE.Scene()
	scene.add(mesh)

	const renderer = new THREE.WebGLRenderer()

	renderer.render(scene, camera)





	/* scene3 = new THREE.Scene();
	scene3.background = new THREE.Color( 0xf0f0f0 );
	const geometry = new THREE.BoxGeometry( 50, 50, 50 );
	const material1 = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );

	mesh = new THREE.Mesh( geometry, material1 );
	mesh.castShadow = true;
	mesh.position.y = 25;
	scene3.add( mesh ); */

	/* scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf0f0f0 ); */

	/* scene2 = new THREE.Scene();

	const material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide } );

	// left
	createPlane(
    	100, 100,
		'chocolate',
		new THREE.Vector3( - 50, 0, 0 ),
		new THREE.Euler( 0, - 90 * THREE.MathUtils.DEG2RAD, 0 )
	);
	// right
	createPlane(
	    100, 100,
		'saddlebrown',
		new THREE.Vector3( 0, 0, 50 ),
		new THREE.Euler( 0, 0, 0 )
	);
	// top
	createPlane(
		100, 100,
		'yellowgreen',
		new THREE.Vector3( 0, 50, 0 ),
		new THREE.Euler( - 90 * THREE.MathUtils.DEG2RAD, 0, 0 )
	);
	// bottom
	createPlane(
		300, 300,
		'seagreen',
		new THREE.Vector3( 0, - 50, 0 ),
		new THREE.Euler( - 90 * THREE.MathUtils.DEG2RAD, 0, 0 )
	);

	//

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( windowWidth, windowHeight );
	container.appendChild( renderer.domElement );

	renderer2 = new CSS3DRenderer();
	renderer2.setSize( windowWidth, windowHeight );
	renderer2.domElement.style.position = 'absolute';
	renderer2.domElement.style.top = 0;
	container.appendChild( renderer2.domElement );

	renderer3 = new THREE.WebGLRenderer();
	renderer3.setPixelRatio( window.devicePixelRatio );
	renderer3.setSize( windowWidth, windowHeight );
	renderer3.domElement.style.position = 'absolute';
	container.appendChild( renderer3.domElement );

	const controls = new OrbitControls( camera, renderer2.domElement );
	controls.minZoom = 0.5;
	controls.maxZoom = 2;

	function createPlane( width, height, cssColor, pos, rot ) {

		const element = document.createElement( 'div' );
		element.style.width = width + 'px';
		element.style.height = height + 'px';
		element.style.opacity = 0.75;
		element.style.background = cssColor;

		const object = new CSS3DObject( element );
		object.position.copy( pos );
		object.rotation.copy( rot );
		scene2.add( object );

		const geometry = new THREE.PlaneGeometry( width, height );
		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy( object.position );
		mesh.rotation.copy( object.rotation );
		scene.add( mesh );

	}

	window.addEventListener( 'resize', onWindowResize );
 
} */

/* function onWindowResize() {

	const aspect = windowWidth / windowHeight;

	camera.left = - frustumSize * aspect / 2;
	camera.right = frustumSize * aspect / 2;
	camera.top = frustumSize / 2;
	camera.bottom = - frustumSize / 2;

	camera.updateProjectionMatrix();

	renderer.setSize( windowWidth, windowHeight );

	renderer2.setSize( windowWidth, windowHeight );

}

function animate() {

	requestAnimationFrame( animate );

	renderer.render( scene, camera );
	renderer2.render( scene2, camera );
	renderer3.render( scene3, camera );

}
 */