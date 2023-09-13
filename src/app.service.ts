import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from 'langchain/prompts';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains';
import * as fs from 'fs';

const openAIkey = 'YOUR_OPENAI_KEY';

@Injectable()
export class AppService {
  async getGPT(curriculo: string): Promise<string> {
    const chat = new ChatOpenAI({
      openAIApiKey: openAIkey,
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0.0,
    });

    //console.time('gpt');

    const baseJson = fs.readFileSync('json.txt', 'utf8');
    const validateJson = fs.readFileSync('validate.txt', 'utf8');

    const prompt = ChatPromptTemplate.fromPromptMessages([
      [
        'system',
        `
      Você é um programa de computador.
      Esse programa lê informações de um curriculo.
      Esses curriculos podem ser em ingles ou português.
      Você retorna um objeto json com as informações a seguir:

      {context}

      usando o curriculo passado pelo usuario, retorne o objeto json com as informações acima           
      caso não consiga retornar todas as informações, retorne o máximo que conseguir


    `.trim(),
      ],
      [
        'human',
        `
      Curriculo:
      {query}
      `.trim(),
      ],
    ]);

    //Simple LLM Chain
    const chain = new LLMChain({ llm: chat, prompt });

    const response1L = await chain.call({
      context: baseJson,
      query: curriculo,
    });

    const unverifiedJson = response1L.text;

    const prompt2L = ChatPromptTemplate.fromPromptMessages([
      [
        'system',
        `
      Você é um programa de computador.
      Esse programa lê informações de um json que contém dados de curriculos.
      Esses dados poderm ser em ingles ou português.

      Você retorna um objeto json validado, fazendo ajustes necessários a seguir:

      {context}

    `.trim(),
      ],
      [
        'human',
        `
      {query}
      `.trim(),
      ],
    ]);

    //Simple LLM Chain
    const chain2L = new LLMChain({
      llm: chat,
      prompt: prompt2L,
    });

    const response2L = await chain2L.call({
      context: validateJson,
      query: unverifiedJson,
    });

    //console.log(response1L);
    //console.log(response2L);
    //console.timeEnd('gpt');

    return response2L.text;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
