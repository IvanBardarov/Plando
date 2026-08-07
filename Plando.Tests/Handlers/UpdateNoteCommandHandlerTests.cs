using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.Notes;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;

public class UpdateNoteCommandHandlerTests
{
    private readonly Mock<INoteRepository> _noteRepositoryMock;
    private readonly UpdateNoteCommandHandler _handler;

    public UpdateNoteCommandHandlerTests()
    {
        _noteRepositoryMock = new Mock<INoteRepository>();
        _handler = new UpdateNoteCommandHandler(_noteRepositoryMock.Object);
    }

    [Fact]
    public async Task HappyPath()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var note = Note.Create("Text content", Guid.NewGuid(), user.Id);
        note.Update("Text content updated");

        _noteRepositoryMock.Setup(o => o.GetByIdAsync(note.Id))
            .ReturnsAsync(note);

        var command = new UpdateNoteCommand(note.Id, "Text content updated");

        var result = await _handler.HandleAsync(command);

        Assert.Equal(note.Content, result.Content);
    }

    [Fact]
    public async Task NoteNotFound()
    {
        _noteRepositoryMock.Setup(o => o.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Note?)null);

        var command = new UpdateNoteCommand(Guid.NewGuid(), "Text content updated");

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }

    [Fact]
    public async Task EmptyContent()
    {
        var note = Note.Create("Text content", Guid.NewGuid(), Guid.NewGuid());

        _noteRepositoryMock.Setup(o => o.GetByIdAsync(note.Id))
            .ReturnsAsync(note);

        await Assert
            .ThrowsAsync<DomainException>(() => _handler
            .HandleAsync(new UpdateNoteCommand(note.Id, string.Empty)));
    }
}