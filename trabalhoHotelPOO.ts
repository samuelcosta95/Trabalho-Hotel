class Cliente{
    private nome: string
    private cpf: string
    private sexo: string
    private telefone: string
    private endereco: string

    constructor(nome: string, cpf: string, sexo: string, telefone: string, endereco: string){
        this.nome = nome
        this.cpf = cpf
        this.sexo = sexo
        this.telefone = telefone
        this.endereco = endereco
    }

    reservar(dias: number, numeroQuarto: number, gerenciadorHotel: GerenciadorDeHotel): void {
        const quarto: Quarto | null = gerenciadorHotel.buscarQuarto(numeroQuarto)

        if (quarto) {
            if (!quarto.getOcupado) {
                const reserva = new Reserva(dias,quarto,this.nome)
                quarto.addReserva(reserva)
                quarto.ocupar()
                reserva.adicionarServico(massagem)
                reserva.adicionarServico(lavanderia)
                console.log(`Reserva realizada para ${this.nome} no quarto ${numeroQuarto} por ${dias} dias.`)
                
            } else {
                throw new Error(`O quarto ${numeroQuarto} está ocupado.`)
            }
        } else {
            throw new Error('Quarto não encontrado')
        }
    }    


}

class Quarto{
    protected numero: number
    protected ocupado: boolean
    protected precoDiaria: number
    protected reservas: Reserva[]

    constructor(numero:number,precoDiaria:number){
        this.numero = numero
        this.ocupado = false
        this.precoDiaria = precoDiaria
        this.reservas = []
    }
    
    get getOcupado(): boolean{
        return this.ocupado
    }

    get getNumero(): number{
        return this.numero
    }

    get getDiaria(): number{
        return this.precoDiaria
    }

    toString(): string{
        let msg = this.ocupado? "ocupado": "livre"
        return `Quarto: ${this.numero},\nStatus: ${msg}\nValor da diária: ${this.precoDiaria}R$`
    }

    addReserva(reserva:Reserva):void{
        this.reservas.push(reserva)
    }

    listarReservas(): string{
        let saida: string = ``
        for (const reserva of this.reservas) {
            saida += reserva.toString() + '\n-------------------\n'
            
        }
        return saida
    }

    ocupar(): void{
        this.ocupado = true
    }

    liberar(): void{
        this.ocupado = false
    }

}

class QuartoPremium extends Quarto{
    private qntFrigobar:number
    
    constructor(numero:number,precoDiaria:number,qntFrigobar:number){
        super(numero,precoDiaria)
        this.qntFrigobar = qntFrigobar
    }

    toString(): string{
        let msg = this.ocupado? "ocupado": "livre"
        return `Quarto: ${this.numero}\nTipo: quarto premium\nStatus: ${msg}\nQuantidade de frigobar: ${this.qntFrigobar}\nValor da diária: ${this.precoDiaria}R$`
    }
}

class QuartoStandard extends Quarto{
    private tipoCama: string

    constructor(numero:number,precoDiaria:number,tipoCama:string){
        super(numero,precoDiaria)
        this.tipoCama = tipoCama
    }

    toString(): string{
        let msg = this.ocupado? "ocupado": "livre"
        return `Quarto: ${this.numero}\nTipo: quarto premium\nStatus: ${msg}\nTipo da cama: ${this.tipoCama}\nValor da diária: ${this.precoDiaria}R$`
    }
}

class GerenciadorDeHotel{
    quartos: Quarto[]

    constructor(){
        this.quartos = []
    }

    adicionarQuarto(quarto: Quarto): void{
        this.quartos.push(quarto)
    }

    buscarQuarto(numeroDoQuarto: number): Quarto | null{
        for (const quarto of this.quartos) {
            if (numeroDoQuarto == quarto.getNumero){
                return quarto
            }
        }
        return null
    }

    listarQuartosDisponiveis(): Quarto[]{
        let quartoDisponivel: Quarto[] = []
        for (const quarto of this.quartos) {
            if(!quarto.getOcupado){
                quartoDisponivel.push(quarto)
            }
        }
        return quartoDisponivel
    }

}

class Servico{
    private tipo: string
    private taxaAdicional: number

    constructor(tipo: string,taxaAdicional: number){
        this.tipo = tipo
        this.taxaAdicional = taxaAdicional
    }

    get getTipo() {
        return this.tipo
    }

    get getTaxa() {
        return this.taxaAdicional
    }

    toString(): string{
        return `Serviço ${this.tipo}: ${this.taxaAdicional}R$\n`
    }

}

class Reserva{
    private servicos: Servico []
    private precoTotal: number 
    private dias: number
    private quarto: Quarto
    private nomeCliente: string
    

    constructor(dias:number,quarto:Quarto,nomeCliente:string){
        this.servicos = []
        this.dias = dias
        this.quarto = quarto
        this.nomeCliente = nomeCliente

        this.precoTotal = dias * quarto.getDiaria
        this.precoTotal += this.totalServicos()
    
    }
    
    toString():string{
        return `Reserva realizada por ${this.nomeCliente} do quarto ${this.quarto.toString()} \n${this.listarServicos()}Total dias: ${this.dias}\nPreço total: ${this.precoTotal}R$`
    }

    adicionarServico(servico:Servico): void{
        this.servicos.push(servico)
        this.precoTotal += servico.getTaxa
    }

    totalServicos():number{
        let saida: number = 0
        for (const servico of this.servicos) {
            saida += servico.getTaxa
            
        }
        return saida
    }

    listarServicos():string{
        let saida: string = ''
        for (const servico of this.servicos) {
            saida += servico.toString()
            
        }
        return saida
    }

}

const cliente1 = new Cliente("José","123.456.654-12","M","86 947242101","Rua Belém")
const cliente2 = new Cliente("Maria","321.555.877-77","F","86 879817455","Rua Pará")

const suiteMaster = new QuartoPremium(123,250,2)
const quartoSolteiro = new QuartoStandard(171,110,"solteiro")

const gerenciadorHotel = new GerenciadorDeHotel()

const lavanderia = new Servico("lavanderia", 50)
const massagem = new Servico("massagem", 95)

gerenciadorHotel.adicionarQuarto(suiteMaster)
gerenciadorHotel.adicionarQuarto(quartoSolteiro)

cliente1.reservar(5,123,gerenciadorHotel)
suiteMaster.liberar()

cliente2.reservar(2,123,gerenciadorHotel)
console.log(suiteMaster.listarReservas())

cliente1.reservar(2,171,gerenciadorHotel)
console.log(quartoSolteiro.toString())


