/** @jsxImportSource react */
import AtividadeForm from './AtividadeForm';

export default function EditAtividade({ atividade, turmas = [], canEditStructure = true }) {
    return (
        <AtividadeForm
            mode="edit"
            atividade={atividade}
            turmas={turmas}
            canEditStructure={canEditStructure}
        />
    );
}
