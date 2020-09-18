import { Router } from 'express';
import { chatApiWebhook } from '../controllers/chat-api-webhook';

const chatApiWebhookRoute = (router: Router): void => {
  router.post('/', chatApiWebhook);
};

export default chatApiWebhookRoute;
