import { Controller, Get, UseGuards, Delete, Param, Post, Body, Patch, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { MyJwtGuard } from '../auth/guard';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
    constructor(private noteService: NoteService) { }
    @UseGuards(MyJwtGuard)
    @Get()
    getNote(@GetUser('id') userId: number) {
        return this.noteService.getNote(userId);
        // return userId
    }

    @Get(':id')
    getNoteById(@Param('id', ParseIntPipe) noteId: number) {
        return this.noteService.getNoteById(noteId);
    }

    @UseGuards(MyJwtGuard)
    @Post()
    insert(@GetUser('id') userId: number,
        @Body() insertDTo: InsertNoteDTO) {
        // console.log(userId)
        // console.log(user.id)
        // return userId
        return this.noteService.insert(userId, insertDTo)
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) noteId: number,
        @Body() updateNoteDTO: UpdateNoteDTO) {
        return this.noteService.update(noteId, updateNoteDTO)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) noteId: number) {
        return this.noteService.delete(noteId)
    }
}
