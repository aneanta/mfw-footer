import {Component, ElementRef,  OnInit, ViewChild} from '@angular/core';
import {ModalService} from "../modal.service";
import {DocumentationDetailModalComponent} from "../documentation-detail-modal/documentation-detail-modal.component";
import {sharedFormModules, sharedModules} from "../shared/shared.module";
import {DocumentationDetailModalModule} from "../documentation-detail-modal/documentation-detail-modal.module";
import * as PDFJS from 'pdfjs-dist';
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [sharedModules, sharedFormModules, DocumentationDetailModalModule],

})


export class HomePage implements OnInit{
  // @ts-ignore
  @ViewChild('filepicker') private picker: ElementRef

  component: any
  filePreviews: Array<{ type: string, data: string| ArrayBuffer | null }> = []
  url: Array<{ src: string, type: string }> = []
  images: string[] = [];
  constructor(private modalService: ModalService) {
  }

  ngOnInit(): void {
  }

  addFile(event: Event): void {
    const input = event.target as HTMLInputElement
    const files = input.files

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const selectedFile = files[i]
        const url= URL.createObjectURL(selectedFile)

        if (selectedFile.type.startsWith('image/')) {

          this.url.push({src: url, type:selectedFile.type})
          // @ts-ignore
          this.displayFilePreview({ type: 'image', data: selectedFile })

        } else if (selectedFile.type.startsWith('video/')) {
          this.generateVideoThumbnail(selectedFile)

        } else if (selectedFile.type.startsWith('application/')) {
          this.convertPDFToBase64(selectedFile, url)
          this.generatePDFThumbnail(selectedFile)
        }
      }
    }
  }



  generateThumbnailVideo(videoFile: File): Promise<string>  {
    return new Promise((resolve) => {
      const videoElement = document.createElement('video')
      videoElement.preload = 'metadata';
      videoElement.src = URL.createObjectURL(videoFile)

      videoElement.onloadedmetadata = () => {
        videoElement.currentTime = 1

        videoElement.onseeked = () => {
          const canvas = document.createElement('canvas')
          canvas.width = videoElement.videoWidth
          canvas.height = videoElement.videoHeight

          const context = canvas.getContext('2d')
          context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

          const thumbnailDataUrl = canvas.toDataURL('image/jpeg')

          resolve(thumbnailDataUrl)

        }
      }
    })

  }


  async generateVideoThumbnail(videoFile: File): Promise<void> {
    try {
      const thumbnail = await this.generateThumbnailVideo(videoFile)
      this.filePreviews.push({ type: 'video', data: thumbnail})
    } catch (error) {
      console.error('Error al generar la miniatura del video:', error)
    }
  }
  generateThumbnailPDF(pdfFile: File, pageIndex: number = 1): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        // @ts-ignore
        const arrayBuffer = e.target.result as ArrayBuffer;


        PDFJS.getDocument({ data: arrayBuffer }).promise.then((pdfDoc) => {
          return pdfDoc.getPage(pageIndex).then((page) => {
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            // @ts-ignore
            return page.render(renderContext).promise.then(() => {
              const thumbnailDataUrl = canvas.toDataURL('image/jpeg');
              resolve(thumbnailDataUrl);
            });


          });
        });
      };

      reader.readAsArrayBuffer(pdfFile);
    });
  }

  async generatePDFThumbnail(pdfFile: File): Promise<void> {
    try {
      const thumbnail = await this.generateThumbnailPDF(pdfFile);
      this.filePreviews.push({ type: 'application', data: thumbnail});
    } catch (error) {
      console.error('Error al generar la miniatura del PDF:', error);
    }
  }

  displayFilePreview(file: { type: string, data: string, url: any | ArrayBuffer | null }): void {
    const reader = new FileReader()

      reader.onload = (e) => {
        // @ts-ignore
        this.filePreviews.push({ type: 'image', data: e.target?.result })
      };

      // @ts-ignore
      reader.readAsDataURL(file.data as File)

  }

  async openDocumentationDetail(url: { src: string, type: string}): Promise<void> {
    console.log(url)
    await this.modalService.presentModal(DocumentationDetailModalComponent, {url:url})

  }
  convertPDFToBase64(pdfFile: File, url: string) {
    const reader = new FileReader();

    reader.onload = (event) => {
      // @ts-ignore
      const pdfBase64 = event.target.result as string;
      this.url.push({src: pdfBase64, type: pdfFile.type})
    };

    reader.readAsDataURL(pdfFile);
  }



}
