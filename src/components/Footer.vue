<template>
  <div class="footer-container">
    <div class="categories-container">
      <SubcategoryContainer :category-list="categoryOne" />
      <SubcategoryContainer :category-list="categoryTwo" />
      <SubcategoryContainer :category-list="categoryThree" />
      <SubcategoryContainer :category-list="categoryFour" />
    </div>
  <div class="infos-container">
    <div class="publicar-car-version-container">
      <span>Novo Consulta Pública</span>
      <span id="version">v1.0</span>
    </div>
    <div class="mgi-logo-container">
      <img src="../assets/logo-mgi-branco.png" alt="">
    </div>  
  </div>
  </div>
  <div class="footer-copyright-container">
    <span>Texto destinado a exibição das informações relacionadas à
      <strong>licença de uso</strong>
    </span>
  </div>
</template>

<script setup>
import SubcategoryContainer from './SubcategoryContainer.vue';

const categoryOne = {
  "title": "INFORMAÇÕES GERAIS",
  "list": [
    {
      "id": 1,
      "name": "Página Inicial do CAR",
      "linkTo": "https://car.gov.br/#"
    },
    {
      "id": 2,
      "name": "Ajuda",
      "linkTo": "https://car.gov.br/#/suporte"
    },
    {
      "id": 3,
      "name": "Sobre o CAR",
      "linkTo": "https://car.gov.br/#/sobre"
    },
    {
      "id": 4,
      "name": "Central de Conteúdo",
      "linkTo": "https://car.gov.br/#/centralConteudo/boletim"
    }
  ]
}

const categoryTwo = {
  "title": "AÇÕES FREQUENTES",
  "list": [
    {
      "id": 1,
      "name": "Baixar Módulo CAR",
      "linkTo": "https://car.gov.br/#/baixar"
    },
    {
      "id": 2,
      "name": "Enviar CAR",
      "linkTo": "https://car.gov.br/#/enviar"
    },
    {
      "id": 3,
      "name": "Retificar um CAR",
      "linkTo": "https://car.gov.br/#/retificar"
    }
  ]
}

const categoryThree = {
  "title": "CONSULTAS",
  "list": [
    {
      "id": 1,
      "name": "Consultar um CAR",
      "linkTo": "https://car.gov.br/#/consultar"
    },
    {
      "id": 2,
      "name": "Painel de Regularização Ambiental",
      "linkTo": "https://app.powerbi.com/view?r=eyJrIjoiZmRiM2QwZDQtYjUxZi00YWI0LWFjNGEtZTIxNjg1YWFkNmZlIiwidCI6ImViMjJjMjU4LWQ0ZWQtNGZmMC04Y2Y2LTI4NmQ2Mjc3OTQ5ZSJ9"
    }
  ]
}

const categoryFour = {
  "title": "ATENDIMENTO",
  "list": [
    {
      "id": 1,
      "name": "Perguntas Frequentes",
      "linkTo": "https://car.gov.br/#/suporte"
    },
    {
      "id": 2,
      "name": "Contatos dos Órgãos Competentes",
      "linkTo": "https://car.gov.br/#/contatos"
    },
    {
      "id": 3,
      "name": "Legislação",
      "linkTo": "https://car.gov.br/#/centralConteudo/legislacao"
    },
    {
      "id": 4,
      "name": "Manuais",
      "linkTo": "https://car.gov.br/#/centralConteudo/manuaisUsuario"
    }
  ]
}

</script>

<style scoped>

.infos-container {
  display: grid;
  grid-template-columns: 1.19fr 1fr;
  align-items: center;
  height: 12vh;
  margin-bottom: 25px;

  .mgi-logo-container { 
    justify-self: end; 
    align-self: end;

  }
  
  .publicar-car-version-container {
    justify-self: end; 
  }

}

.categories-container {
  padding: 40px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}

.footer-container {
  margin-top: 37px;
  padding: 0 40px;
  background: #071D41;
  color: #FFF;
  display: flex;
  flex-direction: column;
  gap: 23px;
  border-bottom: 1px solid #FFF;

  .publicar-car-version-container {
    background: #071D41;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #FFF;
    gap: 5px;

    #version {
      font-size: 12px;
    }

  }

  .title-container {
    padding-top: 34px;

    span {
      color: #FFF;
      font-size: 14px;
    }
  }

  .two-retangle-container {
    display: flex;
    flex-direction: row;
    gap: 23px;
    padding: 30px 0;
  }

  #un-rectangle {
    width: 80px;
    display: flex;
    gap: 7px;
    border: 1px dashed #fff;
    padding: 10px 7px;

    span {
      font-size: 20px;
      font-weight: 300;
    }
  }

  .retangle-container {
    width: 115px;
    display: flex;
    gap: 7px;
    border: 1px dashed #fff;
    padding: 10px 7px;

    span {
      font-size: 20px;
    }

  }

}

img {
  width: 325px;
  max-width: 100%;
}

.footer-copyright-container {
  background: #071D41;
  padding: 15px 40px;
  text-align: center;

  span {
    font-size: 12.6px;
    color: #FFF;
  }

}

@media screen and (max-width: 1265px) {
  .categories-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .infos-container {
    display: none;
  }
}

@media screen and (max-width: 984px) {
  .footer-images-container {
    flex-direction: column;
    gap: 30px;
  }
}
</style>