import { Injectable } from '@angular/core'
import { ComponentRef, ModalOptions } from '@ionic/core'
import { IonRouterOutlet, ModalController } from '@ionic/angular'

@Injectable({
	providedIn: 'root'
})
export class ModalService {
	isModalOpen: boolean = false
	currentModal?: HTMLIonModalElement

	constructor(private modalController: ModalController) {
	}

	async presentModal(
		component: ComponentRef,
		data: Record<string, any> = {},
		cssClass?: string | string[],
		backdrop?: boolean,
		outlet?: IonRouterOutlet,
		onDismiss: (data: any) => void = (): void => {
		}): Promise<HTMLIonModalElement> {

		if (this.isModalOpen) {
			this.dismissModal({}, 'close')

			this.isModalOpen = false
			this.currentModal = undefined
		}


		const props: ModalOptions = {
			component,
			cssClass: [ 'alphega-modal', ...(cssClass ?? '') ],
			componentProps: data,
			showBackdrop: backdrop ?? true,
			mode: 'md'
		}

		if (outlet) {
			props['presentingElement'] = outlet.nativeEl
		}

		this.currentModal = await this.modalController.create(props)

		this.currentModal.onDidDismiss().then(() => {
			this.isModalOpen = false
			this.currentModal = undefined
		})

		if (onDismiss) {
			this.currentModal.onDidDismiss().then((data: any) => {
				onDismiss(data)

				this.isModalOpen = false
				this.currentModal = undefined
			})
		}

		await this.currentModal.present()

		this.isModalOpen = true

		return this.currentModal
	}

	dismissModal(data?: any | object, role?: string, completion?: () => null): void {
		this.modalController.dismiss(data, role).then(() => {
			if (completion) {
				completion()
			}

			this.isModalOpen = false
		})
	}
}
