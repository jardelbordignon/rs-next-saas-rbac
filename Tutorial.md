# [Criando SaaS com Next.js e RBAC - Node e React](https://app.rocketseat.com.br/journey/saa-s-next-js-rbac/contents)

<details>
  <summary>Setup do projeto e permissões</summary>
  
<details>
<summary>Introdução</summary>

 [Post de introdução](https://blog.rocketseat.com.br/rbac-e-abac-modelos-de-controle-de-acesso)
</details>

<details>
<summary>Criando o Monorepo com Turborepo</summary>

***pnpm dlx create-turbo@latest next-saas-rbac***<br/>
selecionei o bun como gerenciador de pacotes

Arrastei eslint-config e typescript-config para dentro de ROOT/configs
rodei o comando ***bun i*** para organizar as dependências

deletei as aplicações web e docs de dentro do diretório apps
</details>

</details>

bun x --bun shadcn@latest init
bun x --bun shadcn@latest add sonner
bun x --bun shadcn@latest add dropdown-menu avatar
bun x --bun shadcn@latest add checkbox
bun x --bun shadcn@latest add sheet
bun x --bun shadcn@latest add skeleton
bun x --bun shadcn@latest add textarea
bun x --bun shadcn@latest add card
bun x --bun shadcn@latest add table
bun x --bun shadcn@latest add select
bun x --bun shadcn@latest add popover
