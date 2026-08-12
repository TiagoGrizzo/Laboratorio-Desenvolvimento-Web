import swaggerAutongen from "swagger-autogen";
const doc = {
    info: {
        title: 'API ToDo List', 
        description: 'Documentação para a geração automática dos testes com swagger'
    },
    host: 'localhost:5000',
    basepath: '/ToDo',
}
const outputFile = './swagger-output.json'; //Nome do arquivo que vai ser gerado automaticamente
const routesFile = ['./Routes/routes.js'] //Caminho para as rotas
swaggerAutongen(outputFile, routesFile, doc);