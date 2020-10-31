var score = 0;
var destruir = [];
var doces = [];
var selecionado1 = -1;
var selecionado2 = -1;
var clicado;
var cont = 1;
var quadrados = document.getElementsByClassName("quadrado");
var scoretext = document.getElementById("score");

Start();

function Start() {

	for (let i = 0; i < quadrados.length; i++) {
		destruir[i] = false;
		doces[i] = Math.floor(Math.random() * 5.005);
		if (doces[i] == 0)
			doces[i] = 1;
	}

	destruirStart();

	for (let i = 0; i < quadrados.length; i++) {
		quadrados[i].innerHTML = "<img src='" + doces[i] + ".png'>"
		quadrados[i].setAttribute("position", i);

		quadrados[i].addEventListener("click", function () {
			clicado = Number(this.getAttribute("position"));

			if (clicado == selecionado1) { return; }
			else {
				cont++
				cont = cont % 2;
				if (cont == 0) {
					selecionado1 = clicado;
					//quadrados[selecionado1].
				}
				else {
					selecionado2 = clicado;
					if (doces[selecionado1] == doces[selecionado2]) { selecionado1 = -1; return; }
					if (selecionado1 + 1 == selecionado2 || selecionado1 - 1 == selecionado2 || selecionado1 + 9 == selecionado2 || selecionado1 - 9 == selecionado2) {
						let aux = doces[selecionado2];
						doces[selecionado2] = doces[selecionado1];
						doces[selecionado1] = aux;
						let im1 = "<img src='" + doces[selecionado1] + ".png'>"
						let im2 = "<img src='" + doces[selecionado2] + ".png'>"
						quadrados[selecionado1].innerHTML = im1;
						quadrados[selecionado2].innerHTML = im2;
						move(selecionado1, selecionado2);
						selecionado1 = -1;
					}
					else {
						selecionado1 = -1;
						//
					}

				}
			}
		});
	}
}

function move(v1, v2) {

	if (v1 == v2 - 1) {
		quadrados[v1].style.animation = 'moveleft 0.4s linear';
		quadrados[v2].style.animation = 'moveright 0.4s linear';
	}
	else if (v1 == v2 + 1) {
		quadrados[v2].style.animation = 'moveleft 0.4s linear';
		quadrados[v1].style.animation = 'moveright 0.4s linear';
	}
	else if (v1 == v2 - 9) {
		quadrados[v1].style.animation = 'moveup 0.4s linear';
		quadrados[v2].style.animation = 'movedown 0.4s linear';
	}
	else {
		quadrados[v1].style.animation = 'movedown 0.4s linear';
		quadrados[v2].style.animation = 'moveup 0.4s linear';
	}

	setTimeout(function () {
		quadrados[v1].style.animation = 'none';
		quadrados[v2].style.animation = 'none';

		if (doces[v1] == 5) {
			destruir[v1] = true;
			marktype(doces[v2]);
		}
		else if (doces[v2] == 5) {
			destruir[v2] = true;
			marktype(doces[v1]);
		}
		else
			destruirdoces();
	}, 401);
};

function marktype(type) {
	for (let n = 0; n < 81; n++) {
		if (doces[n] == type)
			destruir[n] = true;
	}
	explodirdoces();
}

function destruirdoces() {
	//percorre linhas
	for (let n = 0; n < 80; n += 9) {
		let atual = 0;
		for (; atual < 7;)
			if (doces[n + atual] == doces[n + atual + 1]) {
				let j;
				for (j = 1; doces[n + atual] == doces[n + atual + j] && j < 9 - atual; j++) { }
				if (j > 2) {
					for (let k = j - 1; k >= 0; k--)
						destruir[n + atual + k] = true;
				}
				atual += j;
			}
			else atual++;
	}
	//percorre colunas
	for (let n = 0; n < 9; n++) {
		let atual = 0;
		for (; atual < 63;)
			if (doces[n + atual] == doces[n + atual + 9]) {
				let j;
				for (j = 9; doces[n + atual] == doces[n + atual + j] && j < 81 - atual; j += 9) { }
				if (j / 9 > 2) {
					for (let k = j - 9; k >= 0; k -= 9)
						destruir[n + atual + k] = true;
				}
				atual += j;
			}
			else atual += 9;
	}
	explodirdoces();
}

function explodirdoces() {
	let explodidos = 0;
	let qd = document.getElementsByClassName("quadrado");
	for (let n = 0; n < 81; n++)
		if (destruir[n] == true) {
			doces[n] = 0;
			qd[n].innerHTML = "<img src='0.png'>"
			destruir[n] = false;
			explodidos++;
		}

	if (explodidos > 0) {
		score += explodidos ** 2;
		scoretext.innerHTML = "Score:" + score;
		sumirdoces();
	}
}

function sumirdoces() {
	let qd = document.getElementsByClassName("quadrado");
	//em cada doce 0
	for (let x = 100; x >= 50; x--) {
		setTimeout(function () {
			for (let y = 0; y < 81; y++) //percorre todos os elementos
				if (doces[y] == 0)
					qd[y].style.opacity = x / 100;
		}, 450 - x * 3);
	}
	for (let x = 50; x <= 100; x++) {
		setTimeout(function () {
			for (let y = 0; y < 81; y++) //percorre todos os elementos
				if (doces[y] == 0)
					qd[y].style.opacity = x / 100;
		}, 250 + x * 3);
	}
	setTimeout(function () {
		for (let y = 0; y < 81; y++) //percorre todos os elementos
			if (doces[y] == 0)
				qd[y].innerHTML = "";

		cairdoces();
	}, 800);
}

function cairdoces() {
	//percorre ultima linha, coluna por coluna
	for (let y = 72; y < 81; y++) {
		let a = y; //posicao do elemento que sera verificado
		let b = a - 9; //posicao do ultimo diferente de 0
		while (a > 8) {
			if (doces[a] == 0) {
				for (; b >= 0; b -= 9) {
					if (doces[b] != 0) {
						doces[a] = doces[b];
						doces[b] = 0;
						quadrados[a].innerHTML = "<img src='" + doces[a] + ".png'>";
						quadrados[a].style.animation = "down" + ((a - b) / 9) + " 0.5s linear";
						a -= 9;
						break;
					}
				}
				if (b <= 0) break;
			}
			else { a -= 9; b -= 9; }
		}
	}

	gerardoces();
}

function gerardoces() {
	for (let x = 0; x < 81; x++)
		if (doces[x] == 0) {
			doces[x] = Math.floor(Math.random() * 5.1);
			if (doces[x] == 0)
				doces[x] = 1;
			quadrados[x].innerHTML = "<img src='" + doces[x] + ".png'>"
			let decrement = x % 9;
			quadrados[x].style.animation = "down" + ((x - decrement) / 9 + 1) + " 0.5s linear";
		}
	setTimeout(function () {
		for (let x = 0; x < 81; x++)
			quadrados[x].style.animation = 'none';

		destruirdoces();
	}, 701);
}

function destruirStart() {
	//percorre linhas
	for (let n = 0; n < 80; n += 9) {
		let atual = 0;
		for (; atual < 7;)
			if (doces[n + atual] == doces[n + atual + 1]) {
				let j;
				for (j = 1; doces[n + atual] == doces[n + atual + j] && j < 9 - atual; j++) { }
				if (j > 2) {
					for (let k = j - 1; k >= 0; k--)
						destruir[n + atual + k] = true;
				}
				atual += j;
			}
			else atual++;
	}
	//percorre colunas
	for (let n = 0; n < 9; n++) {
		let atual = 0;
		for (; atual < 63;)
			if (doces[n + atual] == doces[n + atual + 9]) {
				let j;
				for (j = 9; doces[n + atual] == doces[n + atual + j] && j < 81 - atual; j += 9) { }
				if (j / 9 > 2) {
					for (let k = j - 9; k >= 0; k -= 9)
						destruir[n + atual + k] = true;
				}
				atual += j;
			}
			else atual += 9;
	}
	explodirStart();
}
function explodirStart() {
	let explodidos = 0;
	for (let n = 0; n < 81; n++)
		if (destruir[n] == true) {
			doces[n] = 0;
			destruir[n] = false;
			explodidos++;
		}

	if (explodidos > 0)
		cairStart();
}

function cairStart() {
	//percorre ultima coluna
	for (let y = 72; y < 81; y++) {
		let a = y; //posicao do elemento que sera verificado
		let b = a - 9; //posicao do ultimo diferente de 0
		while (a > 8) {
			if (doces[a] == 0) {
				for (; b >= 0; b -= 9) {
					if (doces[b] != 0) {
						doces[a] = doces[b];
						doces[b] = 0;
						a -= 9;
						break;
					}
				}
				if (b <= 0) break;
			}
			else { a -= 9; b -= 9; }
		}
	}
	gerarStart();
}
function gerarStart() {
	for (let x = 0; x < 81; x++)
		if (doces[x] == 0) {
			doces[x] = Math.floor(Math.random() * 5.1);
			if (doces[x] == 0)
				doces[x] = 1;
		}
	destruirStart();
}