import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface ExternalLinkModel extends BaseInterface {
	target: string;
	link: string;
	isEnabled: boolean;
}
