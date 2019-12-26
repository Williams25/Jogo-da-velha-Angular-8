import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JogoDaVelhaService {

  /**
   * CRIANDO ATRIBUTOS CONSTANTES QUE NÃO TERAO VALOR MUDADO
   */
  private readonly TAM_TAB: number = 3
  private readonly X: number = 1
  private readonly O: number = 2
  private readonly VAZIO: number = 0
  /**
   * FIM CONSTANTES
   */

  /**
   * ATRIBUTOS DE CONTROLE DO JOGO
   */
  private tabuleiro: any
  private numMovimentos: number
  private vitoria: any
  /**
   * FIM CONTROLE DO JOGO
   */

  /**
   * ATRIBUTOS PARA DEFINIR VENCEDOR, INICIO E FIM DE JOGO
   */
  private _jogador: number
  private _showInicio: boolean
  private _showTabuleiro: boolean
  private _showFinal: boolean

  constructor() { }

  /**
   * INICIALIZA O JOGO. DEFINE EXIBIÇÃO DA TELA INICIAL
   */
  inicializar(): void {
    this._showInicio = true
    this._showTabuleiro = false
    this._showFinal = false
    this.numMovimentos = 0
    this._jogador = this.X
    this.vitoria = false
    this.inicializarTabuleiro()
  }

  /**
   * INICIA O TABULEIRO DO JOGO COM VAZIO PARA TODAS POSIÇÕES
   */
  inicializarTabuleiro(): void {
    this.tabuleiro = [this.TAM_TAB]
    for (let i = 0; i < this.TAM_TAB; i++)
      this.tabuleiro[i] = [this.VAZIO, this.VAZIO, this.VAZIO]
  }

  /**
   * RETORNA SE A TELA DE INICIO DEVE SER EXIBIDA
   */
  get showInicio(): boolean {
    return this._showInicio
  }

  /**
   * RETORNA SE O TABULEIRO DEVE SER EXIBIDO
   */
  get showTabuleiro(): boolean {
    return this._showTabuleiro
  }

  /**
   * RETORNA SE A TELA DE FIM DE JOGO DEVE SER EXIBIDA
   */
  get showFinal(): boolean {
    return this._showFinal
  }

  /**
   * RETORNA O NUMERO DO JOGADOR A JOGAR
   */
  get jogador(): number {
    return this._jogador
  }

  /**
   * EXIBE O TABULEIRO
   */
  iniciarJogo(): void {
    this._showInicio = false
    this._showTabuleiro = true
  }

  /**
   * REALIZA UMA JOGADA DADO AS COORDENADAS DO TABULEIRO
   * @param number posX
   * @param number posY
   * @return void
   */
  jogar(posX: number, posY: number): void {
    // JOGADA INVALIDA
    if (this.tabuleiro[posX][posY] !== this.VAZIO || this.vitoria) return

    this.tabuleiro[posX][posY] = this._jogador // ATRIBUI A JOGADA DO JOGADOR NA POSIÇÃO DO TABULEIRO
    this.numMovimentos++ // INCREMENTA O NUMERO DE MOVIMENTOS
    this.vitoria = this.fimJogo(posX, posY, this.tabuleiro, this._jogador) // VERIFICA SE O JOGO TERMINOU
    this._jogador = (this._jogador === this.X) ? this.O : this.X // MUDO O JOGADOR

    //  VERIFICA SE A MAQUINA PODE JOGAR
    if (!this.vitoria && this.numMovimentos < 9) this.cpuJogador()

    //  VITORIA
    if (this.vitoria !== false) this._showFinal = true

    //  EMPATE
    if (!this.vitoria && this.numMovimentos === 9) {
      this._jogador = 0
      this._showFinal = true
    }
  }

  /**
   * VERIFICA OO FIM DE JOGO
   * @param number linha
   * @param number coluna
   * @param any tabuleiro
   * @param number jogador
   * @return array
   */
  fimJogo(linha: number, coluna: number, tabuleiro: any, jogador: number): any {
    let fim: any = false

    //  VALIDA LINHA
    if (tabuleiro[linha][0] === jogador &&
      tabuleiro[linha][1] === jogador &&
      tabuleiro[linha][2] === jogador)
      fim = [[linha, 0], [linha, 1], [linha, 2]]

    //  VALIDA COLUNA
    if (tabuleiro[coluna][0] === jogador &&
      tabuleiro[coluna][1] === jogador &&
      tabuleiro[coluna][2] === jogador)
      fim = [[coluna, 0], [coluna, 1], [coluna, 2]]

    //  VALIDA DIAGONAIS
    if (tabuleiro[0][0] === jogador &&
      tabuleiro[1][1] === jogador &&
      tabuleiro[2][2] === jogador)
      fim = [[0, 0], [1, 1], [2, 2]]

    //  VALIDA DIAGONAIS
    if (tabuleiro[0][2] === jogador &&
      tabuleiro[1][1] === jogador &&
      tabuleiro[2][0] === jogador)
      fim = [[0, 2], [1, 1], [2, 0]]

    return fim
  }

  /**
   * LOGICA PARA SIMULAR JOGADA DA MAQUINA EM MODO ALEATORIO
   * @return void
   */
  cpuJogador(): void {
    //  VERIFICA A JOGADA DE VITORIA
    let jogada: number[] = this.obterJogada(this.O)

    if (jogada.length <= 0)
      jogada = this.obterJogada(this.X) //  TENTAR EVITAR DERROTA

    if (jogada.length <= 0) {
      let jogadas: any = [] //  JOGA ALEATORIO
      for (let i = 0; i < this.TAM_TAB; i++) { // REALIZA UMA JOGADA ALEATORIA
        for (let j = 0; j < this.TAM_TAB; j++) {
          if (this.tabuleiro[i][j] === this.VAZIO)
            jogadas.push([i, j])
        }
      }
      let k = Math.floor((Math.random() * (jogadas.length - 1)))
      jogada = [jogadas[k][0], jogadas[k][1]]
    }

    this.tabuleiro[jogada[0]][jogada[1]] = this._jogador
    this.numMovimentos++
    this.vitoria = this.fimJogo(jogada[0], jogada[1], this.tabuleiro, this.jogador)
    this._jogador = (this._jogador === this.X) ? this.O : this.X
  }

  /**
   * OBTEM A JOGADA VALIDA PARA VITORIA DE UM JOGADOR
   * @param jogador 
   */
  obterJogada(jogador: number): number[] {
    let tab = this.tabuleiro
    for (let lin = 0; lin < this.TAM_TAB; lin++) {
      for (let col = 0; col < this.TAM_TAB; col++) {
        if (tab[lin][col] !== this.VAZIO)
          continue
        tab[lin][col] = jogador
      }
    }
    return []
  }

  /**
   * RETORNA SE A PEÇA X DEVE SER EXIBIDA PARA A COORDENADA INFORMADA
   * @param posX 
   * @param posY 
   */
  exibirX(posX: number, posY: number): boolean {
    return this.tabuleiro[posX][posY] === this.X
  }

  /**
   * RETORNA SE A PEÇA O DEVE SER EXIBIDA PARA A COORDENADA INFORMADA
   * @param posX 
   * @param posY 
   */
  exibirO(posX: number, posY: number): boolean {
    return this.tabuleiro[posX][posY] === this.O
  }

  /**
   * RETORNA SE A MARCAÇÃO DE VITORIA DEVE SER EXIBIDA PARA COORDENADA INFORMADA
   * @param posX 
   * @param posY 
   */
  exibirVitoria(posX: number, posY: number): boolean {
    let exibirVitoria: boolean = false

    if (!this.vitoria) return exibirVitoria

    for (let pos of this.vitoria) {
      if (pos[0] === posX && pos[1] === posY) {
        exibirVitoria = true
        break
      }
    }
    return exibirVitoria
  }

  /**
   * INICIA UM NOVO JOGO, ASSIM COMO EXIBE O TABULEIRO
   */
  novoJogo(): void {
    this.inicializar()
    this._showFinal = false
    this._showInicio = false
    this._showTabuleiro = true
  }
}
