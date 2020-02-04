# Service-Vue
> Arquitetura de services em projetos Vue.

Service vue é uma arquitetura que tem como objetivo a reutilização de services  e métodos em diferentes ocasiões, diminuindo a complexidade aos acessos a recursos HTTP.

![](https://www.webdatarocks.com/wd_uploads/2019/10/VueTools-3.png)

## Instalação

```sh
npm install
```
## Execução

```sh
npm run serve
```
## Compilação e minificação para a produção

```sh
npm run build
```
## Execução de testes

```sh
npm run test
```
## Entendendo a arquitetura service-vue

Para entender a arquitetura service-vue, é necessário ter em mente como funciona o padrão repository. 
O padrão repository nada mais é que abstrações de objetos ou entidades de um determinado domínio que acessam uma API ou banco de dados. Ele é fortemente vinculado ao domínio da aplicação e este é um reflexo direto das regras de negócio, pois ele abstrai armazenamento e consulta de um ou mais entidades do domínio.
Nesta arquitetura, pelo fato de ser um projeto FRONT-END, não será necessário o uso de entidades, apenas os repositorys que serão nomeados como services.

### Estrutura Global

A estrutura global do service-vue baseia-se em entender alguns diretórios como :
- http-utils
- services

#### Diretório http-utils

No diretório http-utils, existe um arquivo chamado Http.js, onde nele é feita toda a configuração do axios (lib de requisições HTTP), como por exemplo : a baseURL da API, os interceptors, o token caso seja necessário, entre outras configurações.

#### Diretório services

No diretório services, existem dois arquivos, Base.js e ResponseService.js.

No arquivo Base.js, é onde é feita toda a abstração dos métodos que serão mais utilizados na aplicação, como por exemplo, o métodos de CRUD.

##### Base.js
```js
// services/Base.js
import { http } from '@/http-utils/Http'
import { ResponseService } from './ResponseService'
export default class Base {
  constructor (api) {
    this.api = api
    this.http = http
    this.ResponseService = ResponseService
  }
  list = async () => {
    try {
      const response = await this.http.get(this.api)
      return response
    } catch (error) {
      throw this.ResponseService(error, 'list')
    }
  }
  show = async ($id) => {
    try {
      const response = await this.http.get(`${this.api}/${$id}`)
      return response.data
    } catch (error) {
      throw this.ResponseService(error, 'get', 'item')
    }
  }

  create = async ($data) => {
    try {
      const response = await this.http.post(this.api, $data)
      return response.data
    } catch (error) {
      throw this.ResponseService(error, 'create')
    }
  }

  update = async ($data) => {
    try {
      const response = await this.http.put(`${this.api}/${$data.id}`, $data)
      return response.data
    } catch (error) {
      throw this.ResponseService(error, 'update')
    }
  }

  remove = async ($id) => {
    try {
      const response = await this.http.delete(`${this.api}/${$id}`)
      return response.data
    } catch (error) {
      throw this.ResponseService(error, 'remove')
    }
  }
}

```
Aqui temos as importações do Http e do Response Service, onde o http disponibiliza os métodos básicos para acesso as requisições HTTP (get, post, put, delete, etc.) e o ResponseService controla as respostas da requisição, de acordo como status retornado pela mesma.
##### Base.js
```js
// services/Base.js
import { http } from '@/http-utils/Http'
import { ResponseService } from './ResponseService'
``` 
No construtor do Base, é passado como parâmetro o endereço do endpoint da API, sendo assim, é possível criar um atributo atribuindo como valor o parâmetro, permitindo ser disponibilizado para qualquer serviço que herdar a classe Base e para os métodos criados na classe. É utilizada a mesma ideia de disponibilização de atributos com as instâncias de http e ResponseService
##### Base.js
```js
// services/Base.js
  constructor (api) {
    this.api = api
    this.http = http
    this.ResponseService = ResponseService
  }
```
No método list por exemplo, que tem como objetivo listar todas as informações de um determinado domínio, é utilizado o atributo this.api como parâmetro da requisição get, caso seja sucesso a resposta será retornada, caso ocorra algum problema, o atributo erro é passado como parâmetro para o ReponseService, e a string 'list' como segundo parâmetro, que serve para identificar qual a finalidade do método executado.
##### Base.js
```js
// services/Base.js
 list = async () => {
    try {
      const response = await this.http.get(this.api)
      return response
    } catch (error) {
      throw this.ResponseService(error, 'list')
    }
  }
```
### Estrutura de um módulo

A estrutura de um módulo específico do service-vue baseia-se em entender alguns diretórios como :

- services

Diferente do que normalmente é utilizado, tudo relacionado ao módulo será criado em seu próprio diretório (service, store, view), para que assim, seja mais fácil a visualização e utilização destes artefatos.

#### Diretório services

No diretório services, é criado o service específico de um módulo.
O PostService é um exemplo de criação de um service específico de um módulo.

##### PostService.js
```js
// pages/post/services/PostService.js
import Base from '@/services/Base'
class PostService extends Base {
  constructor() {
    super('/posts')
  }
}
export default new PostService()
``` 
O base é importado e através do extends, é herdado para que todos os métodos fiquem disponíveis para o PostService. Com o super, passamos para o construtor do Base o endpoint da API, que no caso é /posts, e exportamos a classe já instanciada.
### Exemplo de uso
##### HelloWorld.vue
```js
// components/HelloWorld.vue
import PostService from '@/service/post/PostService'
export default {
  name: 'HelloWorld',
  data: () => ({
    PostService: new PostService(),
    posts: []
  }),
  mounted () {
    this.getPosts()
  },
  methods: {
    async getPosts () {
     const {data} = await this.PostService.list()
     this.posts = data
    }
  }
}

```
## Autores

- Iago Cavalcante - iagoangelimc@gmail.com
- Waldener Monteiro – jjrr019@gmail.com

## Contribua

1. Faça o _fork_ do projeto (<https://github.com/waldenermonteiro/service-vue.git/fork>)
2. Crie uma _branch_ para sua modificação (`git checkout -b feature/fooBar`)
3. Faça o _commit_ (`git commit -am 'Add some fooBar'`)
4. _Push_ (`git push origin feature/fooBar`)
5. Crie um novo _Pull Request_

## Licença

Distribuído sob a licença MIT.

