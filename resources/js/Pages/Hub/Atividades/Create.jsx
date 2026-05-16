/** @jsxImportSource react */
import AtividadeForm from './AtividadeForm';

export default function CreateAtividade({ turmas = [] }) {
    return (
        <AtividadeForm
            mode="create"
            turmas={turmas}
        />
    );
}
