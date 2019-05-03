import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { FornecedorService } from './../../fornecedores/fornecedor.service';
import { ProdutoService } from './../produto.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { TipoService, TipoFilter } from './../../tipos/tipo.service';

import { Tipo } from './../../model/Tipo';
import { Fornecedor } from 'src/app/model/Fornecedor';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-produto-cadastro',
  templateUrl: './produto-cadastro.component.html',
  styleUrls: ['./produto-cadastro.component.css']
})
export class ProdutoCadastroComponent implements OnInit {

  titulo: string;
  formulario: FormGroup;
  formBuilder = new FormBuilder();
  tipos: Array<Tipo>;
  fornecedores: Array<Fornecedor>;

  constructor(
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private toasty: ToastyService,
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService,
    private tipoService: TipoService
  ) { }

  ngOnInit() {
    this.configurarFormulario();
    const idProduto = this.activateRoute.snapshot.params['id'];
    const tipoFilter = new TipoFilter();
    this.tipoService.pesquisar(tipoFilter)
      .then(response => {
        this.tipos = response.content;
      });

    if (idProduto) {
      this.carregarProduto(idProduto);
      this.titulo = 'Editar';
    } else {
      this.titulo = 'Criar';
    }
  }

  carregarProduto(id: number) {
    this.produtoService.buscarPorCodigo(id)
      .then(response => {
        this.formulario.patchValue(response);
      })
      .catch(error => this.errorHandler.handle(error));
  }

  adicionar() {
    if (this.formulario.value.id === null) {
      this.adicionarProduto();
    } else {
      this.atualizarProduto();
    }
  }

  adicionarProduto() {
    this.produtoService.adicionar(this.formulario.value)
      .then(response => {
        this.toasty.success('Produto adicionado!');
        this.router.navigate(['/produtos']);
      })
      .catch(error => this.errorHandler.handle(error));
  }

  atualizarProduto() {
    this.produtoService.adicionar(this.formulario.value)
      .then(response => {
        this.formulario.patchValue(response);
        this.toasty.success('Produto atualizado!');
      })
      .catch(error => this.errorHandler.handle(error));
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      id: [],
      nome: [null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(4)]],
      estoque: [null],
      valor: [null],
      tipo: this.formBuilder.group({
        id: [''],
        tipo: ['']
      })
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return input.value ? null : {obrigatoriedade: true};
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
    };
  }

}
