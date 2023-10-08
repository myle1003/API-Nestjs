import { ForbiddenException, Injectable, Req } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { InsertNoteDTO, UpdateNoteDTO } from "./dto";

@Injectable({})
export class NoteService {
    constructor(private prismaService: PrismaService,) { }
    async getNote(userId: number) {
        const notes = await this.prismaService.note.findMany({
            where: {
                userId: userId
            }
        })
        if (!notes) {
            return 'ko co'
        }
        return notes
    }

    async getNoteById(noteId: number) {
        const note = await this.prismaService.note.findUnique({
            where: {
                id: noteId
            }
        })
        if (!note) {
            return 'ko co'
        }
        return note
    }

    async insert(userId: number, insertDTo: InsertNoteDTO) {
        // console.log(userId)
        const note = await this.prismaService.note.create({
            data: {
                ...insertDTo,
                userId
            }
        })
        return note
        // return userId
    }

    async update(noteId: number, updateNoteDTO: UpdateNoteDTO) {
        const note = await this.prismaService.note.findUnique({
            where: {
                id: noteId
            }
        })
        if (!note) {
            return 'ko co'
        }
        const notenew = await this.prismaService.note.update({
            where: {
                id: noteId
            },
            data: {
                ...updateNoteDTO
            }
        })
        return notenew

    }

    async delete(noteId: number) {
        const note = await this.prismaService.note.findUnique({
            where: {
                id: noteId
            }
        })
        if (!note) {
            return 'ko co'
        }
        return await this.prismaService.note.delete({
            where: {
                id: noteId
            }
        })
    }

}
