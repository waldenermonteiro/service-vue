import Api from "@/service/Api";
// import { ResponseService } from '@/service/ResponseService'

class PostService extends Api {
  constructor() {
    super("/posts");
  }
}
export default new PostService();
