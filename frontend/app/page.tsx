"use client";

import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {
    ChevronRight,
    Expand,
    FileJson,
    FileSpreadsheet,
    FileText,
    Loader2,
    Menu,
    Moon,
    Plus,
    Search,
    Sun,
    Trash2,
    Upload,
    X
} from "lucide-react";
import {useTheme} from "next-themes";
import {DocumentViewer} from "@/components/document-viewer";
import {parseDocument} from "@/lib/document-parser";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Sheet, SheetContent,} from "@/components/ui/sheet";
import {formatDistanceToNow} from "date-fns";
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import vitesse_black from '@shikijs/themes/vitesse-black'
import vitesse_light from '@shikijs/themes/vitesse-light'
import md from '@shikijs/langs/md'
import json from '@shikijs/langs/json'
import csv from '@shikijs/langs/csv'


const shiki = createHighlighterCoreSync({
    themes:[vitesse_black,vitesse_light],
    langs:[md,json,csv],
    engine: createJavaScriptRegexEngine()
  })

const editor_black = "vitesse-black"
const editor_white = "vitesse-light"

export interface Document {
    id: string;
    document_type: string;
    document_name: string;
    raw_content: string;
    uploaded_on: string,
    line_no?: number;
    content?: string;
    page_no?: number;
}

export interface SearcMatches
{   
    id:string,
    document_type: string;
    document_name: string;
    line_number?: number;
    page_number?: number;
    content: string;
    uploaded_on: string,

}


const backendService = {
    async uploadDocument(files: File | File[],theme:string): Promise<Document[]> {
        const formData = new FormData();

        // Handle single or multiple files
        if (Array.isArray(files)) {
            files.forEach(file => formData.append("files", file));
        } else {
            formData.append("files", files);
        }

        const response = await fetch("http://127.0.0.1:6969/upload_files", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const json_response: any[] = await response.json();  // Assuming response is an array
        const documents: Document[] = [];

        for (const doc of json_response) {
            const raw_content = await parseDocument(doc.raw_content.slice(0, 10));
            const html = shiki.codeToHtml(raw_content, {
                lang: doc.document_type,
                theme: theme
            });

            const isoDate = doc.uploaded_on;
            const uploaded_on = formatDistanceToNow(new Date(isoDate), {addSuffix: true});
            documents.push({
                id: doc.id,
                document_type: doc.document_type,
                document_name: doc.document_name,  // Use the name returned by the server
                raw_content: doc.raw_content,
                content: html,
                uploaded_on: uploaded_on
            });
        }

        return documents;
    },

    async searchDocuments(query: string, matches: SearcMatches[]): Promise<SearcMatches[]> {
//  id
// document_type,
// document_name,
// page_no,
// raw_content,
// content,
// line_no,
// datetime
if (query && query.length <= 3) return matches;
        const queryParam = null;
        const response = await fetch(`http://127.0.0.1:6969/search?query=`);
        const data = await response.json();
        const search_matches: SearcMatches[] = [];
        data.result.map((doc: any[]) => {
            const line = doc[4]
            const document_type = doc[1]
            search_matches.push({
                id:doc[0],
                document_type:document_type,
                document_name:doc[2],
                uploaded_on:doc[7],
                line_number: doc[6],
                page_number: doc[3] | 1,
                content: line
            });
        })
        return search_matches
    },

    async getAllDocuments():Promise<SearcMatches[]>
    {
        //  id
// document_type,
// document_name,
// page_no,
// raw_content,
// content,
// line_no,
// datetime
        const response = await fetch(`http://127.0.0.1:6969/get_all_files`);
        const data = await response.json();
        const documents:SearcMatches[] = []
        data.map((doc: any[]) => {
            documents.push({
                id:doc[0],
                document_type:doc[1],
                document_name:doc[2],
                uploaded_on:doc[3],
                content:doc[4]
            });
        })
        return documents

    }
};


export default function Home() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearcMatches[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<SearcMatches | Document| null>(null);
    const [documentSearchQuery, setDocumentSearchQuery] = useState("");
    const {theme, setTheme} = useTheme();
    const [editorTheme,setEditorTheme] = useState(editor_black)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const checkMobileView = () => {
            setIsMobileView(window.innerWidth < 768);
            setIsSidebarOpen(window.innerWidth >= 768);
        };

        checkMobileView();
        window.addEventListener('resize', checkMobileView);
        return () => window.removeEventListener('resize', checkMobileView);
    }, []);

    useEffect(() => {
        const searchDocuments = async () => {
            setIsSearching(true);
            console.log(searchQuery)
            try {
                const results = await backendService.searchDocuments(searchQuery, searchResults);
                setSearchResults(results);
                console.log(searchResults)
            } finally {
                setIsSearching(false);
            }
        };  

        const debounce = setTimeout(searchDocuments, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery, documents]);

    const handleFileUpload = async (files: FileList | null) => {
        if (!files?.length) return;

        setIsUploading(true);
        try {
            const newDocs = await backendService.uploadDocument(Array.from(files),editorTheme);
            setDocuments(prev => [...prev, ...newDocs]);
        } catch (error) {
            console.error("Error uploading documents:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const deleteDocument = (id: string) => {
        setDocuments(documents.filter((doc) => doc.id !== id));
    };

    const getDocumentIcon = (doc: Document|SearcMatches) => {
        switch (doc.document_type) {
            case 'json':
                return <FileJson className="h-6 w-6 text-primary"/>;
            case 'csv':
            case 'xlsx':
                return <FileSpreadsheet className="h-6 w-6 text-primary"/>;
            default:
                return <FileText className="h-6 w-6 text-primary"/>;
        }
    };

    const highlightText = (text: string, query: string) => {
        if (!query) return text;
        if (!text) return ""

        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <>
                {parts.map((part, i) =>
                        part.toLowerCase() === query.toLowerCase() ? (
                            <span key={i} className="bg-destructive/20 text-destructive font-medium px-0.5 rounded">
              {part}
            </span>
                        ) : (
                            part
                        )
                )}
            </>
        );
    };

    const openDocument = (doc: SearcMatches|Document) => {
        setSelectedDocument(doc);
        setDocumentSearchQuery("");
    };

    const highlightDocumentContent = (content: string, query: string,is_opened:Boolean=false) => {
        if (!query) return content;
        if (!content) return ""
        if (is_opened)
        {
                content = shiki.codeToHtml(content,{
                    lang: "md",
                    theme: editorTheme
                })
        }
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = content.split('\n').map(line => {
            if (!line.toLowerCase().includes(query.toLowerCase())) return line;

            const segments = line.split(regex);
            return segments.map((segment, i) =>
                segment.toLowerCase() === query.toLowerCase()
                    ? `<span class="bg-destructive/20 text-destructive font-medium px-0.5 rounded">${segment}</span>`
                    : segment
            ).join('');
        });

        return parts.join('\n');
    };

    if (!mounted) return null;

    const Sidebar = () => (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between p-4 border-b border-primary/20">
                <h2 className="font-semibold text-lg bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">Files</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        setTheme(theme === "dark" ? "light" : "dark");
                        setEditorTheme(editorTheme==editor_black?editor_white:editor_black);
                      }}
                    className="rounded-full hover:bg-primary/10"
                >
                    {theme === "dark" ? (
                        <Sun className="h-4 w-4"/>
                    ) : (
                        <Moon className="h-4 w-4"/>
                    )}
                </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-2 pr-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                                selectedDocument?.id === doc.id
                                    ? 'bg-primary/10 shadow-lg shadow-primary/5'
                                    : 'hover:bg-primary/5'
                            }`}
                            onClick={() => {
                                openDocument(doc);
                                if (isMobileView) setIsSidebarOpen(false);
                            }}
                        >
                            {getDocumentIcon(doc)}
                            <div className="flex-grow min-w-0">
                                <div className="truncate text-sm font-medium">
                                    {doc.document_name}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className="capitalize">{doc.document_type || 'text'}</span>
                                    <ChevronRight className="h-3 w-3"/>
                                    <span>{doc.uploaded_on}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="p-4 border-t border-primary/20">
                <Button
                    onClick={() => setIsUploadDialogOpen(true)}
                    className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                    <Plus className="h-4 w-4"/>
                    Upload
                </Button>
            </div>
        </div>
    );

    return (
        <div className="h-screen overflow-hidden bg-background transition-colors duration-300">
            <div className="flex h-full">
                {/* Mobile Sidebar */}
                {isMobileView ? (
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetContent side="left" className="w-80 p-0">
                            <Sidebar/>
                        </SheetContent>
                    </Sheet>
                ) : (
                    /* Desktop Sidebar */
                    <div className="w-80 flex-shrink-0 border-r border-primary/20 hidden md:block">
                        <Sidebar/>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div
                        className="flex-shrink-0 p-4 md:p-8 pb-4 bg-background/80 backdrop-blur-sm border-b border-primary/20">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-4 mb-4">
                                {isMobileView && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="md:hidden"
                                    >
                                        <Menu className="h-5 w-5"/>
                                    </Button>
                                )}
                                <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                                    Knowledge Base
                                </h1>
                            </div>
                            <div className="relative group">
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-md blur-md group-hover:blur-lg transition-all opacity-0 group-hover:opacity-100"/>
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                                {isSearching && (
                                    <Loader2
                                        className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground animate-spin"/>
                                )}
                                <Input
                                    placeholder="Search documents..."
                                    className="pl-8 pr-8 bg-background border-primary/20 focus:border-primary/50 transition-colors relative"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-4 md:p-8 pt-4">
                        <div className="max-w-4xl mx-auto">
                            <ScrollArea
                                className="h-[calc(100vh-16rem)] w-full rounded-lg border border-primary/20 bg-card p-4">
                                {searchQuery && searchQuery.length <=3 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        Try searching with more words
                                    </div>):(
                                    <div className="space-y-4">
                                        {(searchQuery ? searchResults : documents).map((doc,index) => (
                                            <div
                                                key={index}
                                                className="p-4 rounded-lg border border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 group cursor-pointer bg-card"
                                                onClick={() => openDocument(doc)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-4">
                                                        {getDocumentIcon(doc)}
                                                        <div>
                                                            <div className="font-medium">
                                                                {highlightText(doc.document_name, searchQuery)}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Uploaded on {doc.uploaded_on}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteDocument(doc.id);
                                                            }}
                                                            className="hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="h-4 w-4"/>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openDocument(doc);
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Expand className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                                {doc.content ? (
                                                    <div className="space-y-2">
                                                            <div key={index} className="mt-2 text-sm">
                                                                <div className="text-xs text-muted-foreground mb-1">
                                                                    Page {doc.page_number}, Line {doc.page_number}
                                                                </div>
                                                                <div className="pl-2 border-l-2 border-primary/20" dangerouslySetInnerHTML={{__html:highlightDocumentContent(doc.content,searchQuery)}}>
                                                                
                                                                </div>
                                                            </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-2">
                                                        {doc.content && (
                                                            <DocumentViewer content={doc.content}/>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                </div>

                {/* Upload Dialog */}
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Upload Document</DialogTitle>
                            <DialogDescription>
                                Drag and drop your files or click to browse
                            </DialogDescription>
                        </DialogHeader>
                        <div
                            className="relative"
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.add('border-primary');
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('border-primary');
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('border-primary');
                                handleFileUpload(e.dataTransfer.files);
                            }}
                        >
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer relative w-full"
                            >
                                <div
                                    className="h-32 w-full border-2 border-dashed rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors">
                                    <div className="text-center space-y-2">
                                        {isUploading ? (
                                            <Loader2 className="mx-auto h-8 w-8 text-primary animate-spin"/>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto h-8 w-8 text-muted-foreground"/>
                                                <div className="text-sm text-muted-foreground">
                                                    Drag & drop or click to upload
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept=".txt,.md,.doc,.docx,.json,.csv,.xlsx,.xls"
                                    multiple
                                    onChange={(e) => handleFileUpload(e.target.files)}
                                />
                            </label>
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                            Supported formats: .txt, .md, .doc, .docx, .json, .csv, .xlsx, .xls
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Document Viewer Dialog */}
                <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
                    <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {selectedDocument && getDocumentIcon(selectedDocument)}
                                    <div>
                                        <DialogTitle>{selectedDocument?.document_name || 'Document Viewer'}</DialogTitle>
                                        <DialogDescription>
                                            {selectedDocument ? `Uploaded on ${selectedDocument.uploaded_on}` : 'View document contents'}
                                        </DialogDescription>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="relative mt-4">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    placeholder="Search in document..."
                                    className="pl-8 bg-background border-primary/20 focus:border-primary/50"
                                    value={documentSearchQuery}
                                    onChange={(e) => setDocumentSearchQuery(e.target.value)}
                                />
                            </div>
                        </DialogHeader>
                        <div className="flex-1 min-h-0 mt-4">
                            <ScrollArea className="h-full">
                                <div className="p-4">
                                    {selectedDocument?.content && (
                                        <div
                                            className="font-mono text-sm whitespace-pre-wrap"
                                            dangerouslySetInnerHTML={{   
                                                __html: highlightDocumentContent(selectedDocument.content,searchQuery,true)
                
                                            }}
                                        />
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
