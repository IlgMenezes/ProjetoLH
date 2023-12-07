function verificarInserirModal() {
  if ($('#modalCarregamento').length === 0) {
    $('body').append(`
      <div id="modalCarregamento" class="modal">
        <div class="modal-content">
          <h2>Aguarde...</h2>
          <p>Processando sua solicitação.</p>
        </div>
      </div>
    `);
  }
}


function mostrarModalCarregamento() {
	verificarInserirModal();
	const modalCarregamento = document.getElementById('modalCarregamento');
	modalCarregamento.classList.add('show');
}

function esconderModalCarregamento() {
	const modalCarregamento = document.getElementById('modalCarregamento');
	modalCarregamento.classList.remove('show');
}

// Exportar as funções para que possam ser usadas por outros scripts
export { mostrarModalCarregamento, esconderModalCarregamento };
