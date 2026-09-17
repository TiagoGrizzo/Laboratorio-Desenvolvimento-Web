import {useState, useEffect, useRef} from "react";
//função tratar as conversões de data falada
function interpretarDataVoz(texto) {
    const fala = texto.toLowerCase().trim();
    const hoje = new Date();
    if(fala.includes("hoje")) {
        return hoje.toISOString().split("T")[0];
    }
    if(fala.includes("amanhã") || fala.includes("amanha")){
        const amanha = new Date();
        amanha.setDate(hoje.getDate()+1);
        return amanha.toISOString().split("T")[0];
    }
    if(fala.includes("depois de amanhã") || fala.includes("depois de amanha")){
        const depoisamanha = new Date();
        depoisamanha.setDate(hoje.getDate()+2);
        return depoisamanha.toISOString().split("T")[0];
    }
    const matchDias = fala.match(/daqui a (\d+) dias/);
    if(matchDias){
        const dias = parseInt(matchDias[1], 10)
        const dataFutura = new Date();
        dataFutura.setDate(hoje.getDate() + dias);
        return dataFutura.toISOString().split("T")[0];
    }
    return "";
}//fim da função
export function useVoiceRecognition(){
    const [textoOuvido, setTextoOuvido] = useState("");
    const [ouvindo, setOuvindo] = useState(false);
    const [suportado, setSuportado] = useState(true);
    const recognitionRef = useRef(null);
    useEffect(()=>{
        //verifica se a api está disponivel no navegador
        if(typeof window !== "undefined"){
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        }
        if(SpeechRecognition){
            const recognition = new SpeechRecognition();
            //microfone ficar contínuo
            recognition.contiuous = true;
            recognition.interimResults = true;
            recognition.lang = "pt-BR"
            //evento dispara quando o audio é processado
            //convertendo em texto
            recognition.onresult = (event)=>{
                let trascricaoFinal = "";
                //acumula todos os trechos da fala confirmados
                //durante a sessão ativa
                for(let i = event.resultIndex; i < event.result.length; i++) {
                    if(event.results[i].isFinal) {
                        trascricaoFinal += event.results[i][0].trasncript + " "
                    }
                }
                if(trascricaoFinal) {
                    setTextoOuvido(trascricaoFinal.trim());
                }
            };
            //evento de erro
            recognition.onerror = (event)=>{
                console.error("Errono conhecimento de voz", event.error);
                setOuvindo(false);
            };
            //fim da fala
            recognition.onend = ()=> {
                setOuvindo(false);
            };
            recognitionRef.current = recognition;
        }
        else
        {
            setSuportado(false);
        }
    }, []);
    //indica ou interrompe a gravação (liga/desliga)
    const iniciarEscuta = ()=> {
        if(!recognitionRef.current) return;
        if(ouvindo) {
            //se já estiver ouvindo o click manual encerra a gravação
            recognitionRef.current.stop();
            setOuvindo(false);
        }
        else
        {
            //limpa os textos e inicia a escuta
            setOuvindo(true);
            recognitionRef.current.start();
        }
    };
    //função para parar a gravação manualemente
    const pararEscuta = ()=> {
        if(recognitionRef.current && ouvindo) {
            recognitionRef.current.stop();
            setOuvindo(false);
        }
    };
    //processar a frase capturada e atuaiza o estado correspondente
    //baseado na palavra chave
    const processarComandoVoz = (
        fala,
        setTitulo,
        setDescricao,
        setDataLimite,
        usuarios = [],
        handleCheckboxChange) =>{
            //expressoes regulares
            const regexTitulo = /(?:título|titulo)\s+(.+)/i;
            const regexDecricao = /(?:descrição|descricao)\s+(.+)/i;
            const regexData = /(?:data|data limite|prazo)\s+(.+)/i;
            const regexParticipante = /(?:participante|participantes|adicionar|incluir)\s+(.+)/i;
        };
}