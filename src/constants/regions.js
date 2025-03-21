import FlagAcre from '@/assets/flags/Flag_Acre.png';
import FlagAmazonas from '@/assets/flags/Flag_Amazonas.png';
import FlagRoraima from '@/assets/flags/Flag_Roraima.png';
import FlagRondonia from '@/assets/flags/Flag_Rondonia.png';
import FlagPara from '@/assets/flags/Flag_Para.png';
import FlagAmapa from '@/assets/flags/Flag_Amapa.png';
import FlagTocantins from '@/assets/flags/Flag_Tocantins.png';
import FlagMaranhao from '@/assets/flags/Flag_Maranhao.png';
import FlagBahia from '@/assets/flags/Flag_Bahia.png';
import FlagCeara from '@/assets/flags/Flag_Ceara.png';
import FlagPernambuco from '@/assets/flags/Flag_Pernambuco.png';
import FlagAlagoas from '@/assets/flags/Flag_Alagoas.png';
import FlagSergipe from '@/assets/flags/Flag_Sergipe.png';
import FlagParaiba from '@/assets/flags/Flag_Paraiba.png';
import FlagRioGrandeDoNorte from '@/assets/flags/Flag_Rio_Grande_do_Norte.png';
import FlagPiaui from '@/assets/flags/Flag_Piaui.png';
import FlagGoias from '@/assets/flags/Flag_Goias.png';
import FlagMatoGrosso from '@/assets/flags/Flag_Mato_Grosso.png';
import FlagMatoGrossoDoSul from '@/assets/flags/Flag_Mato_Grosso_do_Sul.png';
import FlagDistritoFederal from '@/assets/flags/Flag_Distrito_Federall.png'
import FlagSaoPaulo from '@/assets/flags/Flag_Sao_Paulo.png';
import FlagRioDeJaneiro from '@/assets/flags/Flag_Rio_de_Janeiro.png';
import FlagMinasGerais from '@/assets/flags/Flag_Minas_Gerais.png';
import FlagEspiritoSanto from '@/assets/flags/Flag_Espirito_Santo.png';
import FlagParana from '@/assets/flags/Flag_Parana.png';
import FlagSantaCatarina from '@/assets/flags/Flag_Santa_Catarina.png';
import FlagRioGrandeDoSul from '@/assets/flags/Flag_Rio_Grande_do_Sul.png';

export const states = [
  { name: 'AC', flag: FlagAcre },
  { name: 'AM', flag: FlagAmazonas },
  { name: 'RR', flag: FlagRoraima },
  { name: 'RO', flag: FlagRondonia },
  { name: 'PA', flag: FlagPara },
  { name: 'AP', flag: FlagAmapa },
  { name: 'TO', flag: FlagTocantins },
  { name: 'MA', flag: FlagMaranhao },
  { name: 'BA', flag: FlagBahia },
  { name: 'CE', flag: FlagCeara },
  { name: 'PE', flag: FlagPernambuco },
  { name: 'AL', flag: FlagAlagoas },
  { name: 'SE', flag: FlagSergipe },
  { name: 'PB', flag: FlagParaiba },
  { name: 'RN', flag: FlagRioGrandeDoNorte },
  { name: 'PI', flag: FlagPiaui },
  { name: 'GO', flag: FlagGoias },
  { name: 'MT', flag: FlagMatoGrosso },
  { name: 'MS', flag: FlagMatoGrossoDoSul },
  { name: 'DF', flag: FlagDistritoFederal },
  { name: 'SP', flag: FlagSaoPaulo },
  { name: 'RJ', flag: FlagRioDeJaneiro },
  { name: 'MG', flag: FlagMinasGerais },
  { name: 'ES', flag: FlagEspiritoSanto },
  { name: 'PR', flag: FlagParana },
  { name: 'SC', flag: FlagSantaCatarina },
  { name: 'RS', flag: FlagRioGrandeDoSul },
]

export const addFlagToState = (stateCode) => {
  return states.find(element => element.name === stateCode)?.flag
};

