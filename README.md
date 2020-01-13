## Entendendo a arquitetura service-vue

Para entender a arquitetura service-vue, é necessário ter em mente como funciona o padrão repository. 
O padrão repository nada mais é que abstrações de objetos ou entidades de um determinado domínio que acessam uma API ou banco de dados. Ele é fortemente vinculado ao domínio da aplicação e este é um reflexo direto das regras de negócio, pois ele abstrai armazenamento e consulta de um ou mais entidades do domínio.
Em nossa arquitetura, pelo fato de ser um projeto FRONT-END, não será necessário o uso de entidades, apenas os repositorys que serão nomeados como services.

### Estrutura Global

A estrutura global do service-vue baseia-se em entender alguns diretórios como :
- http-utils
- services

#### Diretório http-utils

No diretório http-service, existe um arquivo chamado Http.js, onde nele é feita toda a configuração do axios (lib de requisições HTTP), como por exemplo : a baseURL da API, os interceptors, o token caso seja necessário, entre outras configurações.

#### Diretório services

No diretório services, existem dois arquivos, Base.js e ResponseService.js.

No arquivo Base.js, é onde é feita toda a abstração dos métodos que serão mais utilizados na aplicação, como por exemplo, o CRUD.
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
Aqui temos as importações do Http e do Response Service( que veremos mais pra frente), onde o http disponibiliza os métodos básicos para acesso as requisições HTTP (get, post, put, delete, etc.) e o ResponseService controla a resposta da requisição, de acordo como status retornado pela mesma.
##### Base.js
```js
// services/Base.js
import { http } from '@/http-utils/Http'
import { ResponseService } from './ResponseService'
``` 
No construtor do Base, é passado como patrâmetro o endereço do endpoint da API, sendo assim, é possível criar um atributo atribuindo como valor o parâmetro, permitindo ser disponibilizado para qualquer serviço que herdar a classe Base e para os métodos criados na classe. É utilizada a mesma ideia de disponibilização de atributos com as instâncias de http e ResponseService
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

A estrutura de um módulo específic9 do service-vue baseia-se em entender alguns diretórios como :
- services

Diferente do que normalmente é utilizado, aqui é utilizado tudo relacionado ao módulo em seu próprio diretório (service, store, view), para que assim, seja mais fácil de encontrar os arquivos do mesmo.
#### Diretório services
No diretório services é onde é criado o service específico de um módulo.
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
O base é importado, e através do extends,  é herdado para que todos os métodos fiquem disponíveis para o PostService. Com o super, passamos para o construtor do Base o endpoint da API, que no caso é /posts, e exportamos a classe já instanciada.
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
