import { Router } from 'express';
import { chatApiWebhook } from '../controllers/chat-api-webhook';

const chatApiWebhookRoute = (router: Router) => {
  router.post('/', chatApiWebhook);
};

export default chatApiWebhookRoute;
