export interface RegistryBook {
	id: string;
	year: number;
	lastEntryNumber: number;
}

export type DiplomaFieldType = 'STRING' | 'NUMBER' | 'DATE';

export interface GraduationDecision {
	id: string;
	registryBookId: string;
	decisionNumber: string;
	issueDate: string;
	summary: string;
	searchCount: number;
}

export interface DiplomaFieldDefinition {
	id: string;
	key: string;
	label: string;
	fieldType: DiplomaFieldType;
	sortOrder: number;
	isActive: boolean;
}

export type DynamicValues = Record<string, string | number | null>;

export interface Diploma {
	id: string;
	graduationDecisionId: string;
	registryBookId: string;
	entryNumber: number;
	diplomaSerialNumber: string;
	studentId: string;
	fullName: string;
	birthDate: string;
	dynamicValues: DynamicValues;
}

export interface DiplomaLookupLog {
	id: string;
	graduationDecisionId: string | null;
	createdAt: string;
}
