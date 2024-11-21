$(document).ready(function () {
  // Carrega o menu
  $("#menu-placeholder").load("menu/menu.html", function () {
      // Define o nome do usuário após o menu ser carregado
      const nomeUsuario = localStorage.getItem('uname') || 'Usuário';
      $("#nomeUsuario").text(nomeUsuario);

      // Destaca a opção atual no menu
      const currentPage = window.location.pathname.split("/").pop(); 
      const titles = {
          "apontamento_horas.html": "Cadastro de Apontamento",
          "cadastro_projetos.html": "Cadastro de Centro de Custo",
          "edicao_usuario.html": "Edição de Usuario",
          "gerencia_projeto.html": "Gerência de Centro de Custo",
          "listagem_apontamentos.html": "Listagem de Horas",
          "listagem_despesas.html": "Listagem de Despesas",
          "listagem_projetos.html": "Listagem de Centros de Custo",
          "listagem_usuarios.html": "Listagem de Usuários",
          
      };
      const pageTitle = titles[currentPage] || "SGH - SIMATEC";
      $("#page-title").text(pageTitle);

      $(".nav-link").each(function () {
          const linkHref = $(this).attr("href");
          if (linkHref === currentPage) {
              $(this).addClass("active");
          }
      });

      const maiorFunc = parseInt(localStorage.getItem("maiorFunc")) || 0;

        if (maiorFunc >= 6) {
            $(".light-content.services a").show();
        } else {
            $(".light-content.services a").each(function () {
                const nivelMinimo = parseInt($(this).attr("data-nivel-minimo")) || 1;
                if (maiorFunc >= nivelMinimo) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
  });
});
