using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();
builder.Services.AddCors(options =>
{
    options.AddPolicy(
       "AcessoTotal", builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
    );
});
var app = builder.Build();


app.MapGet("/", () => "Prova A1");

//ENDPOINTS DE CATEGORIA
//GET: http://localhost:5000/api/categoria/listar
app.MapGet("/api/categoria/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Categorias.Any())
    {   
        return Results.Ok(ctx.Categorias.ToList());
    }
    return Results.NotFound("Nenhuma categoria encontrada");
});

//POST: http://localhost:500/api/categoria/cadastrar
app.MapPost("/api/categoria/cadastrar", ([FromServices] AppDataContext ctx, [FromBody] Categoria categoria) =>
{
    ctx.Categorias.Add(categoria);
    ctx.SaveChanges();
    return Results.Created("", categoria);
});

//ENDPOINTS DE TAREFA
//GET: http://localhost:5000/api/tarefas/listar
app.MapGet("/api/tarefas/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Tarefas.Any())
    {
        var tarefasComCategoria = ctx.Tarefas
            .Include(t => t.Categoria)
            .Select(t => new 
            {
                t.TarefaId,
                t.Titulo,
                t.Descricao,
                t.Status,
                t.CriadoEm,
                t.CategoriaId,
                t.Categoria.Nome
            })
            .ToList();

        return Results.Ok(tarefasComCategoria);
    }

    return Results.NotFound("Nenhuma tarefa encontrada");
});

//POST: http://localhost:5000/api/tarefas/cadastrar
app.MapPost("/api/tarefas/cadastrar", ([FromServices] AppDataContext ctx, [FromBody] Tarefa tarefa) =>
{
    Categoria? categoria = ctx.Categorias.Find(tarefa.CategoriaId);
    if (categoria == null)
    {
        return Results.NotFound("Categoria não encontrada");
    }
    tarefa.Categoria = categoria;
    ctx.Tarefas.Add(tarefa);
    ctx.SaveChanges();
    return Results.Created("", tarefa);
});

//PUT: http://localhost:5000/api/tarefas/alterar/{id}
app.MapPatch("/api/tarefas/alterar/{id}", ([FromServices] AppDataContext ctx, [FromRoute] string id, [FromBody] Tarefa tarefaAtualizada) =>
{

    Tarefa? tarefa = ctx.Tarefas.FirstOrDefault(x => x.TarefaId == id);

    if (tarefa is null) return Results.NotFound("Tarefa não encontrada");


    if (!string.IsNullOrEmpty(tarefaAtualizada.Titulo)) tarefa.Titulo = tarefaAtualizada.Titulo;
    if (!string.IsNullOrEmpty(tarefaAtualizada.Descricao)) tarefa.Descricao = tarefaAtualizada.Descricao;
    if (!string.IsNullOrEmpty(tarefaAtualizada.Status)) tarefa.Status = tarefaAtualizada.Status;


    if (!string.IsNullOrEmpty(tarefaAtualizada.CategoriaId))
    {
        Categoria? categoria = ctx.Categorias.FirstOrDefault(c => c.CategoriaId == tarefaAtualizada.CategoriaId);
        if (categoria is null) return Results.NotFound("Categoria não encontrada");
        tarefa.Categoria = categoria;
    }

    ctx.Tarefas.Update(tarefa);
    ctx.SaveChanges();

    return Results.Ok("Tarefa atualizada com sucesso");
});






//GET: http://localhost:5000/api/tarefas/naoconcluidas
app.MapGet("/api/tarefas/naoconcluidas", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Tarefas.Any())
    {
        var tarefasNaoConcluidas = ctx.Tarefas
            .Include(t => t.Categoria)
            .Where(x => x.Status != "Concluída")
            .Select(t => new
            {
                t.TarefaId,
                t.Titulo,
                t.Descricao,
                t.Status,
                t.CriadoEm,
                t.CategoriaId,
                t.Categoria.Nome
            })
            .ToList();

        return Results.Ok(tarefasNaoConcluidas);
    }
    return Results.NotFound("Nenhuma tarefa não concluída encontrada");
});

//GET: http://localhost:5000/api/tarefas/concluidas
app.MapGet("/api/tarefas/concluidas", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Tarefas.Any())
    {
        var tarefasConcluidas = ctx.Tarefas
            .Include(t => t.Categoria)
            .Where(x => x.Status == "Concluída")
            .Select(t => new
            {
                t.TarefaId,
                t.Titulo,
                t.Descricao,
                t.Status,
                t.CriadoEm,
                t.CategoriaId,
                t.Categoria.Nome
            })
            .ToList();

        return Results.Ok(tarefasConcluidas);
    }
    return Results.NotFound("Nenhuma tarefa concluída encontrada");
});

app.MapGet("/api/tarefas/buscar/{id}", ([FromRoute] string id, [FromServices] AppDataContext ctx) =>
{
    //Endpoint com várias linhas de código 
    Tarefa? tarefa = ctx.Tarefas.FirstOrDefault(x => x.TarefaId == id);

    if (tarefa is null) return Results.NotFound("Tarefa não Encotrada");
    return Results.Ok(tarefa);

});

app.UseCors("AcessoTotal");
app.Run();

